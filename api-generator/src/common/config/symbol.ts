import type { Project } from "@/common/api/project";
import type { Service } from "@/common/api/service";

export const ProjectKey: InjectionKey<Ref<Project.ProjectInfo | undefined>> = Symbol("project");
export const ProjectOnGetKey: InjectionKey<() => void> = Symbol("projectOnGet");
export const ServiceKey: InjectionKey<Ref<Service.ServiceInfo | undefined>> = Symbol("service");
