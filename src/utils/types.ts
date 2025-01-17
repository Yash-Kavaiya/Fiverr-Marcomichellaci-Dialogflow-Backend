export interface Credentials {
    type: string
    project_id: string
    private_key_id: string
    private_key: string
    client_email: string
    client_id: string
    auth_uri: string
    token_uri: string
    auth_provider_x509_cert_url: string
    client_x509_cert_url: string
    universe_domain: string
}

interface IntentInfo {
    lastMatchedIntent: string
    displayName: string
    confidence: number
}

interface ParameterInfo {
    displayName: string
    required: boolean,
    state: "PARAMETER_STATE_UNSPECIFIED" | "EMPTY" | "INVALID" | "FILLED"
    value?: {
        [key: string]: any;
    }
}

interface FormInfo {
    parameterInfo: ParameterInfo[]
}

export interface PageInfo {
    currentPage: string
    displayName: string
    formInfo?: FormInfo
}

export interface SessionInfo {
    session: string
    parameters?: {
        [key: string]: any;
    };
}

interface FulfillmentInfo {
    tag: string
}

interface TextMessage {
    text: {
        text: string[]
        redactedText: string[]
    }
    responseType: string
    source: string
}

interface LanguageInfo {
    inputLanguageCode: string
    resolvedLanguageCode: string
    confidenceScore: number
}

export interface DetectIntentResponse {
    detectIntentResponseId: string
    intentInfo: IntentInfo
    pageInfo: PageInfo
    sessionInfo: SessionInfo
    fulfillmentInfo: FulfillmentInfo
    messages: TextMessage[]
    text: string
    languageCode: string
    languageInfo: LanguageInfo
}

export interface DialogflowMessage {
    text: {
        text: string[]
        redactedText: string[]
    }
    responseType: string
}

export interface DialogflowResponse {
    fulfillmentResponse?: {
        messages: DialogflowMessage[]
    }
    sessionInfo?: SessionInfo
    pageInfo?: PageInfo
}

interface Address {
    street: string
    city: string
    province: string
    postalCode: string
}

interface OperatingHours {
    open: string
    close: string
}

interface DailyHours {
    lunch: OperatingHours
    dinner: OperatingHours
}

export interface WeeklyOperatingHours {
    Monday: DailyHours
    Tuesday: DailyHours
    Wednsday: DailyHours
    Thursday: DailyHours
    Friday: DailyHours
    Saturday: DailyHours
    Sunday: DailyHours
}

export interface Holiday {
    date: string
    reason: string
}

interface SpecialEvent {
    date: string
    name: string
    description: string
    requiresReservation: boolean
}

export interface Restaurant {
    name: string
    cuisine: string
    phone: string
    address: Address
    contactEmail: string
    websiteUrl: string
    operatingHours: WeeklyOperatingHours
    holidays: Holiday[]
    specialEvents: SpecialEvent[]
    paymentAccepted: string[]
    takeaway: boolean
    petAccepted: boolean
    tableTypes: string[],
    groupSize: number
    isConfirmationRequired: boolean
}

export interface Bookings {
    id?: string
    reservationNumber: number
    customerEmail: string
    customerName: string
    customerPhone: string
    date: string
    duration: string
    endTime: string
    partySize: number
    allergyTableRequests: string,
    additionalRequests: string,
    startTime: string
    status: "pending" | "confirmed" | "cancelled"
}

interface AccpetAllDayReservation {
    status: boolean
    bookingStartTime: string
    bookingEndTime: string
    totalSeats: number
    availableSeats: number
    duration: string
}

export interface Slot {
    bookingStartTime: string
    bookingEndTime: string
    startTime: string
    endTime: string
    availableSeats: number
    duration: string
}

interface Shift {
    totalSeats: number
    availableSeats: number
    timeSlots: Slot[]
}

export interface Availability {
    date: string
    accpetAllDayReservation: AccpetAllDayReservation
    lunch: Shift,
    dinner: Shift
}

export interface BookingDateAndTime {
    bookingDate: string
    bookingTime: string
    currentDay: string
    bookingDay: string
}

export interface BookingDate {
    bookingDate: string
    bookingDay: string
}

export interface WaitingList {
    name: string
    phone: string
    bookingDate: string
    bookingTime: string
    partySize: number
    duration: string
    status: "pending" | "confirmed" | "cancelled"
}

export interface Callback {
    name: string
    phone: string
    callbackDate: string
    callbackTime: string,
    reason: string
    status: "pending" | "confirmed" | "cancelled"
}
