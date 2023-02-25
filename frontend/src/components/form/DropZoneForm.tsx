import { Alert, Group, Text } from "@mantine/core";
import { Dropzone, type DropzoneProps } from "@mantine/dropzone";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import { type PropsWithoutRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

import { api } from "~/utils/api";

export interface DropZoneFormProps {
  name: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  accept?: DropzoneProps["accept"];
  label?: string;
}

export const DropZoneForm = ({
  outerProps,
  label,
  name,
  ...props
}: DropZoneFormProps) => {
  const {
    control,
    watch,
    formState: { isSubmitting, errors },
    setValue,
  } = useFormContext();

  const error = errors[name]?.message as string;
  const { mutateAsync, isLoading } = api.nft.uploadfile.useMutation();
  const [isfileLoading, setFileLoading] = useState(false);

  return (
    <div {...outerProps}>
      <div className={watch("preview_url") ? "hidden" : ""}>
        <label>{label}</label>
        <Controller
          control={control}
          {...props}
          name="fileupload"
          render={({ field }) => (
            <Dropzone
              loading={isSubmitting || isLoading || isfileLoading}
              onDrop={async (files) => {
                const file = files[0];
                setFileLoading(true);
                const { uploadNFTContent } = await mutateAsync({
                  name: file?.name as string,
                  contentType: file?.type as string,
                  posterContentType: file?.type as string,
                  description: "Created using Realestate by Real estate",
                });

                const content = uploadNFTContent?.files?.[0];

                if (content) content.contentType = file?.type.split("/")[0];

                await fetch(content?.url, {
                  method: "PUT",
                  body: file,
                  headers: {
                    "Content-Type": file?.type as string,
                  },
                });

                const poster = uploadNFTContent?.poster;

                await fetch(poster?.url, {
                  method: "PUT",
                  body: file,
                  headers: {
                    "Content-Type": file?.type as string,
                  },
                });

                setValue(name, {
                  id: uploadNFTContent?.id,
                  fileId: content?.id as string,
                  posterId: poster?.id as string,
                });

                setFileLoading(false);

                if (file) setValue("preview_url", URL.createObjectURL(file));
              }}
              onReject={(files) => console.log("rejected files", files)}
              {...field}
            >
              <Group
                position="center"
                spacing="xl"
                style={{
                  minHeight: 220,
                  pointerEvents: "none",
                }}
              >
                <Dropzone.Accept>
                  <IconUpload size={50} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={50} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto size={50} stroke={1.5} />
                </Dropzone.Idle>
                <div>
                  <Text size="xl" inline>
                    Drag images here or click to select files
                  </Text>
                  <Text size="sm" color="dimmed" inline mt={7}>
                    Attach as many files as you like, each file should not
                    exceed 5mb
                  </Text>
                </div>
              </Group>
            </Dropzone>
          )}
        />
      </div>

      {watch("preview_url") && (
        <img
          className="h-auto w-[200px]"
          src={watch("preview_url")}
          alt="preview"
        />
      )}
      {error && <Alert color="red">{error}</Alert>}
    </div>
  );
};

export default DropZoneForm;
