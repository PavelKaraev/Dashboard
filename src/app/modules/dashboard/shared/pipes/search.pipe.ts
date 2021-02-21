import { Pipe, PipeTransform } from "@angular/core";
import { Project } from '../../../../shared/interfaces/project'

@Pipe({
  name: 'searchProjects'
})

export class SearchPipe implements PipeTransform {
  transform(projects: Project[], search = ''): Project[] {
    if(!search.trim()) {
      return projects;
    }
    return projects.filter(project => {
      return project.title.toLowerCase().includes(search.toLowerCase());
    })
  }
}