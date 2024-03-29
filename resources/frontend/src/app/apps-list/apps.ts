export class App {
    name:string;
    route: string;
    icon: string;
    permission?: string; //Si tiene permisos se motrara/oculatara dependiendo de los permisos que el usuario tenga asignado
    hideHome?:boolean; //Si es verdadero ocultara el elemento que dirige a raiz, en la lista que aparece en los modulos con hijos (la raiz es la ruta de la aplicación padre)
    isHub?:boolean; //Si es verdadero solo mostrara la aplicación en el HUB cuando tenga al menos un hijo activo, de lo contario se ocultara, si es falso siempre estara presente en el HUB (tomando encuenta los permisos asignados) sin importar si tiene hijos o no activos
    children?:App[]; //Lista de modulos y componentes hijos de la aplicación
}

export const APPS:App [] = [
    { name:'Dashboard', route: "dashboard",     icon:"assets/icons/dashboard.svg",                permission:'JIZVHPLq3b50VmEiwHDoGOViE63rBJpF',
      children:[
        {name:'Configuración',route:'dashboard/configuracion', icon:'settings',                   permission:"JIZVHPLq3b50VmEiwHDoGOViE63rBJpFa"}
      ]
    },
    { name:"Usuarios",          route: "usuarios",      icon: "assets/icons/users.png",           permission:"nTSk4Y4SFKMyQmRD4ku0UCiNWIDe8OEt" },
    { name:'Permisos',          route: "permisos",      icon: "assets/icons/permisos.png",        permission:"RGMUpFAiRuv7UFoJroHP6CtvmpoFlQXl" },
    { name:'Roles',             route: "roles",         icon: "assets/icons/roles.png",           permission:"nrPqEhq2TX0mI7qT7glaOCJ7Iqx2QtPs" },
    
    { name:'Catalogos',         route: "catalogos",     icon: "assets/icons/catalogos.png",           isHub:true, hideHome:true, 
      children:[
        {name:'Clues',            route:'catalogos/clues',            icon:'insert_drive_file',   permission:"24p0iBXPi2tuFIMpsBidJJM8zntDRWdW"},
        {name:'Localidad',        route:'catalogos/localidad',        icon:'insert_drive_file',   permission:"twwLu82n3lPgQ23WW4NqWCTDr8am2y8f"},
        {name:'Colonias',         route:'catalogos/colonias',         icon:'insert_drive_file',   permission:"w62gtpZsqx6hXAWyPvu8A2ESeYCdWcBW"},
        {name:'Personal Salud',   route:'catalogos/personal-salud',   icon:'insert_drive_file',   permission:"4GuLXazBm4JM3jBVM8tUJKdAurUIaMWl"},
        {name:'Personal Externo', route:'catalogos/personal-externo', icon:'insert_drive_file',   permission:"J6zwhAEnB2IL4gDs7kP6OkoFccxMFcUu"},
        { name:'Grupos',route:'catalogos/grupos',                     icon:'group_work',          permission:"v5xfsLRdLaESqktB1HKQwwWXkfVP4jQe" },
    
      ],
    },
    { name:'Regionalizacion',         route: "regionalizacion",     icon: "assets/icons/regionalizar.png",        isHub:true, hideHome:true, 
      children:[
        {name:'Unidades Médicas',            route:'regionalizacion/clues',           icon:'insert_drive_file',   permission:"PpTb9p3TnJ5twCdeC7KgY35ufijRmQmk"},
        {name:'Personal',                    route:'regionalizacion/personal',        icon:'insert_drive_file',   permission:"XCTyIErEiKjwBZwk8CShgdrYdu02sVhO"},
    
      ],
    },
    { name:"Mapa",          route: "mapa",      icon: "assets/icons/regionalizacion.png",                         permission:"JuGmLNcjjgiRyOaqycHDjA7Zj5zEuXnT" },
    
    { name:'Herramientas Dev',  route: "dev-tools",     icon: "assets/icons/toolbox.svg",                         isHub:true, hideHome:true, 
      children:[
        {name:'Reportes MySQL',route:'dev-tools/mysql-reportes', icon:'insert_drive_file',                        permission:"EvefdJKpqNEULLBiQxvLqpK4V05njdOX"}
      ],
    }

]