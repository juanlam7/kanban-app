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
import { addOrUpdateTaskToColumnImmutable, id } from "@/lib/utils";
import {
  closeAddAndEditTaskModal,
  getActiveBoardIndex,
  getAddAndEditTaskModalTitle,
  getAddAndEditTaskModalValue,
  getAddAndEditTaskModalVariantValue,
  getCurrentBoardName,
} from "@/redux/features/appSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  useFetchDataFromDbQuery,
  useUpdateBoardToDbMutation,
} from "@/redux/services/apiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import * as z from "zod";

const TaskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Task title cannot be empty."),
  description: z.string().optional(),
  status: z.string().min(1, "Status cannot be empty."),
  subtasks: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().min(1, "Subtask title cannot be empty."),
        isCompleted: z.boolean(),
      })
    )
    .min(1, "At least one subtask is required."),
});

type TaskFormValues = z.infer<typeof TaskSchema>;

export default function AddOrEditTaskModal() {
  const dispatch = useAppDispatch();
  const isModalOpen = useAppSelector(getAddAndEditTaskModalValue);
  const modalVariant = useAppSelector(getAddAndEditTaskModalVariantValue);
  const isVariantAdd = modalVariant === "Add New Task";
  const currentTaskTitle = useAppSelector(getAddAndEditTaskModalTitle);
  const activeBoardIndex = useAppSelector(getActiveBoardIndex);
  const currentBoardTitle = useAppSelector(getCurrentBoardName);

  const { data } = useFetchDataFromDbQuery();
  const [updateBoardToDb, { isLoading }] = useUpdateBoardToDbMutation();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "",
      subtasks: [{ id: id(), title: "", isCompleted: false }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "subtasks",
  });

  useEffect(() => {
    if (data) {
      const activeBoard = data[0]?.boards[activeBoardIndex];
      if (activeBoard) {
        const { columns } = activeBoard;
        if (isVariantAdd) {
          form.reset({
            title: "",
            description: "",
            status: "",
            subtasks: [{ id: id(), title: "", isCompleted: false }],
          });
        } else {
          const activeTask = columns
            .flatMap((column) => column.tasks)
            .find((task) => task.title === currentTaskTitle);
          if (activeTask) {
            form.reset(activeTask);
          }
        }
      }
    }
  }, [
    activeBoardIndex,
    currentTaskTitle,
    data,
    form,
    isVariantAdd,
    modalVariant,
  ]);

  const onSubmit = async (values: TaskFormValues) => {
    if (data) {
      const [boards] = data;

      const taskId = values.id || id();

      const newData = addOrUpdateTaskToColumnImmutable(
        boards,
        currentBoardTitle,
        values.status,
        {
          id: taskId,
          title: values.title,
          status: values.status,
          description: values.description ?? "",
          subtasks: values.subtasks,
        }
      );

      await updateBoardToDb(newData.boards);
      dispatch(closeAddAndEditTaskModal());
    }
  };

  const closeModal = () => dispatch(closeAddAndEditTaskModal());

  return (
    <Modal isOpen={isModalOpen} onRequestClose={closeModal}>
      <ModalBody>
        <p className="font-bold text-lg">{modalVariant}</p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5 py-5"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem className="!mt-2">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task Title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="!mt-2">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <textarea
                      placeholder="Task Description"
                      {...field}
                      className="border bg-background hide-scrollbar p-2 w-full rounded text-sm h-16"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="hide-scrollbar overflow-x-auto overflow-y-auto max-h-28 !m-1 py-1">
              {fields.map((subtask, index) => (
                <div
                  key={subtask.id}
                  className="flex justify-around items-end space-y-2"
                >
                  <FormField
                    control={form.control}
                    name={`subtasks.${index}.isCompleted`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`subtasks.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        {index === 0 && (
                          <FormLabel>
                            Subtasks (
                            {
                              fields?.filter(
                                (subtask) => subtask?.isCompleted === true
                              ).length
                            }{" "}
                            of {fields?.length})
                          </FormLabel>
                        )}

                        <FormControl>
                          <Input
                            placeholder="Subtask Title"
                            {...field}
                            className="md:min-w-80"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    onClick={() => remove(index)}
                    variant="ghost"
                  >
                    <FaTimes />
                  </Button>
                </div>
              ))}
            </div>

            <Button
              className="!mt-1"
              type="button"
              onClick={() =>
                append({ id: id(), title: "", isCompleted: false })
              }
            >
              + Add Subtask
            </Button>

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="!mt-2">
                  <FormLabel>Status</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="border bg-background p-2 w-full rounded text-sm"
                    >
                      <option value="" disabled>
                        Select Status
                      </option>
                      {data &&
                        data[0]?.boards[activeBoardIndex]?.columns.map(
                          (col) => (
                            <option key={col.name} value={col.name}>
                              {col.name}
                            </option>
                          )
                        )}
                    </select>
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full rounded transition">
              {isLoading
                ? "Saving..."
                : isVariantAdd
                ? "Create Task"
                : "Save Changes"}
            </Button>
          </form>
        </Form>
      </ModalBody>
    </Modal>
  );
}
