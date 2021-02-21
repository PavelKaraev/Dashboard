import { FileUpload } from "./file-upload";

export interface Project {
  id?: string,
  title: string,
  description: string,
  thumbnail: string,
  thumbnailData: File,
  screenshots: string[],
  screenshotsData: File[],
  date?: Date,
  repostitory?: string,
  url?: string,
  category?: string,
  status?: string
}
