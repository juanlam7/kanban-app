"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Modal, ModalBody } from "@/components/ui/Modal";
import { id } from "@/lib/utils";
import {
  closeAddAndEditBoardModal,
  getActiveBoardIndex,
  getAddAndEditBoardModalValue,
  getAddAndEditBoardModalVariantValue,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/redux/services/apiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import * as z from "zod";

enum ModalVariantEnum {
  AddNewBoard = "Add New Board",
  EditBoard = "Edit Board",
}

const modalVariantTranslations = {
  [ModalVariantEnum.AddNewBoard]: "add_new_board",
  [ModalVariantEnum.EditBoard]: "edit_board",
};

const BoardSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Board name cannot be empty."),
  columns: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Column name cannot be empty."),
        tasks: z.array(z.any()),
      })
    )
    .min(1, "At least one column is required."),
});

type BoardFormValues = z.infer<typeof BoardSchema>;

export default function AddAndEditBoardModal() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(getAddAndEditBoardModalValue);
  const modalVariant = useAppSelector(getAddAndEditBoardModalVariantValue) as ModalVariantEnum;
  const isVariantAdd = modalVariant === ModalVariantEnum.AddNewBoard;
  const activeBoardIndex = useAppSelector(getActiveBoardIndex);
  const t = useTranslations();

  const { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();

  const form = useForm<BoardFormValues>({
    resolver: zodResolver(BoardSchema),
    defaultValues: {
      name: "",
      columns: [{ id: id(), name: "", tasks: [] }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "columns",
  });

  useEffect(() => {
    if (data) {
      if (isVariantAdd) {
        form.reset({
          name: "",
          columns: [{ id: id(), name: "", tasks: [] }],
        });
      } else {
        const activeBoard = data[0]?.boards[activeBoardIndex];
        if (activeBoard) {
          form.reset(activeBoard);
        }
      }
    }
  }, [data, isVariantAdd, activeBoardIndex, form]);

  const onSubmit = async (values: BoardFormValues) => {
    if (data) {
      const [boards] = data;

      const newBoardList = isVariantAdd
        ? [...boards.boards, { ...values, id: id() }]
        : boards.boards.map((board, index) =>
            index === activeBoardIndex ? { ...board, ...values } : board
          );

      await updateBoardToDb(newBoardList);
      dispatch(closeAddAndEditBoardModal());
    }
  };

  const closeModal = () => dispatch(closeAddAndEditBoardModal());

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p className="font-bold text-lg">
          {modalVariant.length > 0 && t(modalVariantTranslations[modalVariant])}
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-5"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("board_name")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("board_name")} {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="mt-5">
              {fields.map((column, index) => (
                <div
                  key={column.id}
                  className="flex justify-around items-end space-y-2"
                >
                  <FormField
                    control={form.control}
                    name={`columns.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && <FormLabel>{t("columns")}</FormLabel>}
                        <FormControl>
                          <Input
                            className="md:min-w-96"
                            placeholder={t("column_name")}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <FaTimes />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              type="button"
              onClick={() => append({ id: id(), name: "", tasks: [] })}
              className="w-full"
            >
              + {t("add_new_column")}
            </Button>

            <Button type="submit" className="w-full mt-5">
              {isLoading
                ? t("saving")
                : isVariantAdd
                ? t("create_board")
                : t("save_changes")}
            </Button>
          </form>
        </Form>
      </ModalBody>
    </Modal>
  );
}
