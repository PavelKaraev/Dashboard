import { FileUpload } from "../../modules/dashboard/shared/interfaces/file-upload";

export interface Project {
  id?: string,
  title: string,
  description: string,
  thumbnail: {},
  thumbnailData: File,
  screenshots: string[],
  screenshotsData: File[],
  date?: Date,
  repository?: string,
  url?: string,
  category?: string,
  status?: string
}
