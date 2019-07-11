import { CommandType } from "./enums/command-type";
import { CommandParams } from "./interfaces/command-params";

export const commandsMap = new Map<CommandType, CommandParams>([
    [CommandType.SectionModule, {
        title: 'Section Module',
        command: 'section-module --name %s',
        params: ['section'],
    }],
    [CommandType.PageModule, {
        title: 'Page Module',
        command: 'page-module --section %s --name %s',
        params: ['section', 'page'],
    }],
    [CommandType.PageModuleService, {
        title: 'Page Module Service',
        command: 'page-module --section %s --name %s --withService',
        params: ['section', 'page'],
    }],
    [CommandType.PageModuleComponent, {
        title: 'Page Component',
        command: 'page-child-component --section %s --page %s --name %s',
        params: ['section', 'page', 'component']
    }],
    [CommandType.ChildPageModule, {
        title: 'Child Page Module',
        command: 'child-page-module --section %s --parentPage %s --name %s',
        params: ['section', 'parent page', 'page'],
    }],
    [CommandType.ChildPageComponent, {
        title: 'Child Page Component',
        command: 'child-page-component --section %s --parentPage %s --page %s --name %s',
        params: ['section', 'parent page', 'page', 'component'],
    }],

    [CommandType.SharedComponent, {
        title: 'Shared Component',
        command: 'shared-module --name %s --component',
        params: ['component'],
    }],
    [CommandType.SharedDirective, {
        title: 'Shared Directive',
        command: 'shared-module --name %s --directive',
        params: ['directive'],
    }],
    [CommandType.SharedPipe, {
        title: 'Shared Pipe',
        command: 'shared-module --name %s --pipe',
        params: ['pipe'],
    }],
    [CommandType.SharedService, {
        title: 'Shared Service',
        command: 'shared-module --name %s --service',
        params: ['service'],
    }],

    [CommandType.SectionSharedComponent, {
        title: 'Section Shared Component',
        command: 'section-shared-module --section %s --name %s --component',
        params: ['section', 'component'],
    }],
    [CommandType.SectionSharedDirective, {
        title: 'Section Shared Directive',
        command: 'section-shared-module --section %s --name %s --directive',
        params: ['section', 'directive'],
    }],
    [CommandType.SectionSharedPipe, {
        title: 'Section Shared Pipe',
        command: 'section-shared-module --section %s --name %s --pipe',
        params: ['section', 'pipe'],
    }],
    [CommandType.SectionSharedService, {
        title: 'Section Shared Service',
        command: 'section-shared-module --section %s --name %s --service',
        params: ['section', 'service'],
    }],
  ]);