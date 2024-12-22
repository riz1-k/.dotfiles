import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TFileMetadata, useFileUpload } from '@/lib/hooks/useFileUpload';
import { getErrorMessage } from '@/lib/utils';
import { env } from '@/lib/utils/env';
import { TFile } from '@/lib/utils/file-utils';
import { AnimatePresence, motion } from 'framer-motion';
import { ImageUp, XIcon } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import Cropper from 'react-easy-crop';
import { toast } from 'sonner';

interface ImageUploaderProps {
  title: string;
  maxFiles: number;
  files: TFile[];
  onChange: (files: TFile[]) => void;
  aspectRatio?: number;
  fileMetadata: TFileMetadata;
}

interface CropData {
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function ImageUploader(props: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [cropDialogOpen, setCropDialogOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropData | null>(
    null
  );

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const uploadMutation = useFileUpload({
    onSuccess: (data) => {
      props.onChange?.([...(props.files ?? []), ...data.map((x) => x.file)]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    onError: (error) => {
      toast.error(getErrorMessage(error));
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setCurrentFile(selectedFile);
      setCropDialogOpen(true);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setCurrentFile(droppedFile);
      setCropDialogOpen(true);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const removeFile = (fileId: string) => {
    props.onChange((props.files || []).filter((file) => file._id !== fileId));
  };

  const onCropComplete = useCallback(
    (_croppedArea: unknown, croppedAreaPixels: any) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CropData,
    rotation = 0
  ): Promise<File> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.translate(safeArea / 2, safeArea / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-safeArea / 2, -safeArea / 2);

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x,
      0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob && currentFile) {
          resolve(
            new File([blob], currentFile.name, { type: currentFile.type })
          );
        }
      }, currentFile?.type);
    });
  };

  const handleCropSave = async () => {
    if (currentFile && croppedAreaPixels) {
      try {
        const croppedImage = await getCroppedImg(
          URL.createObjectURL(currentFile),
          croppedAreaPixels,
          rotation
        );

        uploadMutation.mutate({
          files: [croppedImage],
          data: props.fileMetadata,
        });
      } catch (error) {
        console.error('Error cropping image:', error);
        toast.error('Error cropping image');
      }
      setCropDialogOpen(false);
      setCurrentFile(null);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setRotation(0);
    }
  };

  return (
    <>
      <Card className='w-full max-w-xl'>
        <CardContent className='p-6 ring rounded-md ring-primary/60 w-full'>
          <motion.div
            className={`rounded-lg p-4 text-center mb-4 ${isDragging ? 'bg-primary/10' : ''}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            animate={{
              scale: isDragging ? 1.05 : 1,
              boxShadow: isDragging
                ? '0px 0px 8px rgba(0, 0, 0, 0.1)'
                : '0px 0px 0px rgba(0, 0, 0, 0)',
            }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <ImageUp className='mx-auto mb-2 text-primary' size={48} />
              <p className='text-sm text-gray-500'>
                Drag and drop or choose
                <br />
                images from your computer
              </p>
            </motion.div>
          </motion.div>
          <Button
            className='w-full'
            onClick={() => {
              if (
                props.fileMetadata.purpose === 'CATALOG_MEDIA' &&
                props.files?.length >= (props.maxFiles || 1)
              ) {
                alert(
                  "You've reached the limit of media you can upload, Upgrade your plan to add more"
                );
              } else {
                fileInputRef.current?.click();
              }
            }}
            aria-disabled={props.files?.length >= (props.maxFiles || 1)}
            isLoading={uploadMutation.isPending}
          >
            {props.title ?? 'Upload Images'}
          </Button>
          <input
            ref={fileInputRef}
            type='file'
            className='hidden'
            onChange={handleFileChange}
            accept='image/*'
          />
          <p className='text-xs text-center mt-2 text-muted-foreground'>
            Only support image files
          </p>
          <FilesView files={props.files || []} removeFile={removeFile} />
        </CardContent>
      </Card>

      <Dialog open={cropDialogOpen} onOpenChange={setCropDialogOpen}>
        <DialogContent className='sm:max-w-2xl'>
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          <div className='relative w-full h-[500px]'>
            {currentFile && (
              <Cropper
                image={URL.createObjectURL(currentFile)}
                crop={crop}
                zoom={zoom}
                aspect={props.aspectRatio}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                rotation={rotation}
                onRotationChange={setRotation}
              />
            )}
          </div>
          <div className='flex justify-between items-center'>
            <label>Zoom</label>
            <input
              type='range'
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby='Zoom'
              onChange={(e) => setZoom(Number(e.target.value))}
              className='w-1/2'
            />
          </div>
          <div className='flex justify-between items-center'>
            <label>Rotation</label>
            <input
              type='range'
              value={rotation}
              min={0}
              max={360}
              step={1}
              aria-labelledby='Rotation'
              onChange={(e) => setRotation(Number(e.target.value))}
              className='w-1/2'
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleCropSave}
              isLoading={uploadMutation.isPending}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function FilesView({
  files,
  removeFile,
}: {
  files: TFile[];
  removeFile: (id: string) => void;
}) {
  return (
    <motion.div className='flex flex-wrap gap-3 justify-evenly mt-4' layout>
      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file._id}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className='cursor-move'
          >
            <FileComponent
              file={file}
              removeFile={() => removeFile(file._id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function FileComponent({
  file,
  removeFile,
}: {
  file: TFile;
  removeFile: () => void;
}) {
  const fileName = file.meta.fileName.slice(0, 25).split('.')[0];
  const previewUrl = env.CDN_URL + file.src;

  return (
    <motion.div
      className='relative w-28 h-28'
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <img
        src={previewUrl}
        alt={fileName}
        className='w-full h-full rounded-md object-cover pointer-events-none'
      />
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={(e) => {
          e.stopPropagation();
          removeFile();
        }}
        type='button'
        className='rounded-full border-2 border-border size-5 absolute right-1 top-1 p-0 bg-background flex items-center justify-center'
      >
        <XIcon size={12} />
      </motion.button>
    </motion.div>
  );
}
