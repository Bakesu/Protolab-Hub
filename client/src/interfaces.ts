interface PrinterDTO {
    _id: string,
    printer_name: string,
    temp_nozzle: number,
    temp_bed: number,
    material: string,
    pos_z_mm: number,
    printing_speed: number,
    flow_factor: number,
    progress: number,
    print_dur?: string,
    time_est: number,
    time_zone?: string,
    project_name?: string,
    timestamp: string,
    status?: string
}

interface TemperatureDTO {
    timestamp: string,
    temp_bed: number
    temp_nozzle: number
}

export type { PrinterDTO, TemperatureDTO }
