export enum MessageKeys {
    WELCOME_MESSAGE = "WELCOME_MESSAGE",
    BOOKING_SAVED = "BOOKING_SAVED",
    BOOKING_NOT_SAVED = "BOOKING_NOT_SAVED"
}

export const messageVariableMap: Record<MessageKeys, string[]> = {
    [MessageKeys.WELCOME_MESSAGE]: ["restaurantName"],
    [MessageKeys.BOOKING_SAVED]: ["reservationNumber"],
    [MessageKeys.BOOKING_NOT_SAVED]: ["errorReason"],
}

export type MessageVariables = {
    [MessageKeys.WELCOME_MESSAGE]: { restaurantName: string }
    [MessageKeys.BOOKING_SAVED]: { reservationNumber: number }
    [MessageKeys.BOOKING_NOT_SAVED]: { errorReason: string }
}
