"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { Photo } from "@/lib/types"
import { useState, useEffect, useRef } from "react"
import { uploadPhoto, getGuesthousePhotos, deletePhoto, updatePhotoCaption } from "@/lib/actions/photos"
import { ImageIcon, Loader2, Trash2, Upload, X } from "lucide-react"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PhotoGalleryManagerProps {
  guesthouses: Array<{ id: string; name: string; city: string | null }>
}

export function PhotoGalleryManager({ guesthouses }: PhotoGalleryManagerProps) {
  const [selectedGuesthouseId, setSelectedGuesthouseId] = useState<string>(guesthouses[0]?.id || "")
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [deletePhotoId, setDeletePhotoId] = useState<string | null>(null)
  const [editingCaption, setEditingCaption] = useState<{ id: string; caption: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedGuesthouse = guesthouses.find((g) => g.id === selectedGuesthouseId)

  useEffect(() => {
    if (selectedGuesthouseId) {
      loadPhotos()
    }
  }, [selectedGuesthouseId])

  const loadPhotos = async () => {
    setIsLoading(true)
    try {
      const data = await getGuesthousePhotos(selectedGuesthouseId)
      setPhotos(data)
    } catch (error) {
      console.error("Failed to load photos:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      for (const file of Array.from(files)) {
        await uploadPhoto({
          guesthouse_id: selectedGuesthouseId,
          file,
        })
      }
      await loadPhotos()
    } catch (error) {
      console.error("Failed to upload photos:", error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDeletePhoto = async () => {
    if (!deletePhotoId) return

    try {
      await deletePhoto(deletePhotoId)
      await loadPhotos()
    } catch (error) {
      console.error("Failed to delete photo:", error)
    } finally {
      setDeletePhotoId(null)
    }
  }

  const handleUpdateCaption = async (photoId: string, caption: string) => {
    try {
      await updatePhotoCaption(photoId, caption)
      await loadPhotos()
      setEditingCaption(null)
    } catch (error) {
      console.error("Failed to update caption:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Select Guesthouse</CardTitle>
          <CardDescription>Choose a guesthouse to manage its photo gallery</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="guesthouse">Guesthouse</Label>
            <Select value={selectedGuesthouseId} onValueChange={setSelectedGuesthouseId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a guesthouse" />
              </SelectTrigger>
              <SelectContent>
                {guesthouses.map((guesthouse) => (
                  <SelectItem key={guesthouse.id} value={guesthouse.id}>
                    {guesthouse.name}
                    {guesthouse.city && ` • ${guesthouse.city}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Upload Photos</Label>
            <div className="flex gap-2">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileSelect}
                disabled={isUploading}
                className="flex-1"
              />
              <Button disabled={isUploading} onClick={() => fileInputRef.current?.click()}>
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">Select one or more images to upload</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photo Gallery</CardTitle>
          <CardDescription>
            {selectedGuesthouse
              ? `${photos.length} photo${photos.length !== 1 ? "s" : ""} for ${selectedGuesthouse.name}`
              : "Select a guesthouse"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : photos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No photos yet. Upload some to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {photos.map((photo) => (
                <div key={photo.id} className="group relative overflow-hidden rounded-lg border bg-muted">
                  <div className="aspect-video relative">
                    <Image
                      src={photo.url || "/placeholder.svg"}
                      alt={photo.caption || "Guesthouse photo"}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() => setDeletePhotoId(photo.id)}
                        className="h-8 w-8"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="p-3">
                    {editingCaption?.id === photo.id ? (
                      <div className="flex gap-2">
                        <Input
                          value={editingCaption.caption}
                          onChange={(e) => setEditingCaption({ id: photo.id, caption: e.target.value })}
                          placeholder="Add a caption..."
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateCaption(photo.id, editingCaption.caption)}
                          className="h-8"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingCaption(null)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <p
                        className="text-sm text-muted-foreground cursor-pointer hover:text-foreground"
                        onClick={() => setEditingCaption({ id: photo.id, caption: photo.caption || "" })}
                      >
                        {photo.caption || "Click to add caption..."}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={!!deletePhotoId} onOpenChange={(open) => !open && setDeletePhotoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Photo</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this photo? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePhoto} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
