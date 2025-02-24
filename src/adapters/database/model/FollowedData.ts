type FollowedDataHistory = {
    timestamp: number,
    value: number,
}

export type FollowedData = {
    id: string
    name: string,
    value: number,
    h_value: number,
    l_value: number,
    history: FollowedDataHistory[]
}
