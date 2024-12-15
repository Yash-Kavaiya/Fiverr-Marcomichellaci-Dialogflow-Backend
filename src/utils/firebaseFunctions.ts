import admin from "firebase-admin"

const FIREBASE_CREDENTIALS = JSON.parse(process.env.FIREBASE_CREDENTIALS as string)

function getFirebaseAdmin() {
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: FIREBASE_CREDENTIALS.project_id,
                clientEmail: FIREBASE_CREDENTIALS.client_email,
                privateKey: FIREBASE_CREDENTIALS.private_key
            }),
            databaseURL: "https://restaurant_bookings.firebaseio.com"
        })
    }
    return admin
}

const db = getFirebaseAdmin().firestore()

import { Availability, Bookings, Callback, Restaurant, WaitingList } from "./types"

const restaurantCollectionName = "test_restaurants"
const bookingsCollectionName = "bookings"
const availabilityCollectionName = "availability"
const waitingListCollectionName = "waitingList"
const callbackRequestsCollectionName = "callbackRequests"

export const findRestaurantByPhone = async (restaurantNumber: string): Promise<{ data: Restaurant, id: string } | null> => {
    try {
        const restaurantSnapshot = await db.collection(restaurantCollectionName).where("phone", "==", restaurantNumber).limit(1).get()
        if (!restaurantSnapshot.empty) {
            const restaurant = restaurantSnapshot.docs[0].data() as Restaurant
            return {
                data: restaurant,
                id: restaurantSnapshot.docs[0].id
            }
        }
        return null
    } catch (error) {
        console.error('Error at findRestaurantByPhone:', error)
        return null
    }
}

export const findAvailabilityByRestaurantPhoneAndDate = async ({ restaurantNumber, date }: { restaurantNumber: string, date: string }): Promise<{ data: Availability, id: string } | null> => {
    try {
        const restaurantSnapshot = await db.collection(restaurantCollectionName).where("phone", "==", restaurantNumber).limit(1).get()
        if (!restaurantSnapshot.empty) {
            const restaurant = restaurantSnapshot.docs[0]
            const availabilitySnapshot = await db.collection(restaurantCollectionName)
                .doc(restaurant.id)
                .collection(availabilityCollectionName)
                .where('date', '==', date)
                .limit(1)
                .get()
            if (!availabilitySnapshot.empty) {
                const restaurant = availabilitySnapshot.docs[0].data() as Availability
                return {
                    data: restaurant,
                    id: availabilitySnapshot.docs[0].id
                }
            } else {
                return null
            }
        }
        return null
    } catch (error) {
        console.error('Error at findAvailabilityByRestaurantPhoneAndDate:', error)
        return null
    }
}

export const addBookings = async ({ booking, restaurantId }: { booking: Bookings, restaurantId: string }): Promise<{ id: string, status: boolean }> => {
    try {
        const restaurantRef = db.collection(restaurantCollectionName).doc(restaurantId)
        const bookingsRef = restaurantRef.collection(bookingsCollectionName)
        const newBookingRef = await bookingsRef.add(booking)
        return {
            id: newBookingRef.id,
            status: true
        }
    } catch (error) {
        console.error('Error at addBookings:', error)
        return {
            id: "",
            status: false
        }
    }
}

export const addWaitingList = async ({ waitingList, restaurantId }: { waitingList: WaitingList, restaurantId: string }): Promise<{ id: string, status: boolean }> => {
    try {
        const restaurantRef = db.collection(restaurantCollectionName).doc(restaurantId)
        const waitingListRef = restaurantRef.collection(waitingListCollectionName)
        const newWaitingList = await waitingListRef.add(waitingList)
        return {
            id: newWaitingList.id,
            status: true
        }
    } catch (error) {
        console.error('Error at addWaitingList:', error)
        return {
            id: "",
            status: false
        }
    }
}

export const addCallback = async ({ callback, restaurantId }: { callback: Callback, restaurantId: string }): Promise<{ id: string, status: boolean }> => {
    try {
        const restaurantRef = db.collection(restaurantCollectionName).doc(restaurantId)
        const callbackRef = restaurantRef.collection(callbackRequestsCollectionName)
        const newCallback = await callbackRef.add(callback)
        return {
            id: newCallback.id,
            status: true
        }
    } catch (error) {
        console.error('Error at addCallback:', error)
        return {
            id: "",
            status: false
        }
    }
}

export const findBookingByCustomerPhone = async ({ customerPhone, restaurantId, status }: { customerPhone: string, restaurantId: string, status: string }): Promise<{ data: Bookings[] } | null> => {
    try {
        const bookingsSnapshot = await db.collection(restaurantCollectionName)
            .doc(restaurantId)
            .collection(bookingsCollectionName)
            .where('customerPhone', '==', customerPhone)
            .where("status", "==", status)
            .get()
        if (!bookingsSnapshot.empty) {
            const bookings = bookingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Bookings[]
            return {
                data: bookings
            }
        } else {
            return null
        }
    } catch (error) {
        console.error('Error at findBookingByCustomerPhone:', error)
        return null
    }
}

export const findBookingByCustomerEmail = async ({ email, restaurantId }: { email: string, restaurantId: string }): Promise<{ data: Bookings[] } | null> => {
    try {
        const bookingsSnapshot = await db.collection(restaurantCollectionName)
            .doc(restaurantId)
            .collection(bookingsCollectionName)
            .where('customerEmail', '==', email)
            .where("status", "==", "pending")
            .get()
        if (!bookingsSnapshot.empty) {
            const bookings = bookingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Bookings[]
            return {
                data: bookings
            }
        } else {
            return null
        }
    } catch (error) {
        console.error('Error at findBookingByCustomerEmail:', error)
        return null
    }
}

export const findBookingByCustomerName = async ({ name, restaurantId }: { name: string, restaurantId: string }): Promise<{ data: Bookings[] } | null> => {
    try {
        const bookingsSnapshot = await db.collection(restaurantCollectionName)
            .doc(restaurantId)
            .collection(bookingsCollectionName)
            .where("status", "==", "pending")
            .get()
        if (!bookingsSnapshot.empty) {
            const nameLower = name.toLowerCase()
            const bookings = bookingsSnapshot.docs
                .map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Bookings))
                .filter((booking: Bookings) =>
                    booking.customerName.toLowerCase().includes(nameLower)
                )

            if (bookings.length > 0) {
                return { data: bookings }
            }
            return null
        } else {
            return null
        }
    } catch (error) {
        console.error('Error at findBookingByCustomerName:', error)
        return null
    }
}

export const findBookingByCustomerDate = async ({ date, restaurantId }: { date: string, restaurantId: string }): Promise<{ data: Bookings[] } | null> => {
    try {
        const bookingsSnapshot = await db.collection(restaurantCollectionName)
            .doc(restaurantId)
            .collection(bookingsCollectionName)
            .where('date', '==', date)
            .where("status", "==", "pending")
            .get()
        if (!bookingsSnapshot.empty) {
            const bookings = bookingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Bookings[]
            return {
                data: bookings
            }
        } else {
            return null
        }
    } catch (error) {
        console.error('Error at findBookingByCustomerDate:', error)
        return null
    }
}

export const findBookingByCustomerDateAndBookingStatus = async ({ date, restaurantId, status }: { date: string, restaurantId: string, status: string }): Promise<{ data: Bookings[] } | null> => {
    try {
        const bookingsSnapshot = await db.collection(restaurantCollectionName)
            .doc(restaurantId)
            .collection(bookingsCollectionName)
            .where('date', '==', date)
            .where("status", "==", status)
            .get()
        if (!bookingsSnapshot.empty) {
            const bookings = bookingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Bookings[]
            return {
                data: bookings
            }
        } else {
            return null
        }
    } catch (error) {
        console.error('Error at findBookingByCustomerDateAndBookingStatus:', error)
        return null
    }
}

export const findBookingByCustomerReservationNumber = async ({ reservationNumber, restaurantId }: { reservationNumber: string, restaurantId: string }): Promise<{ data: Bookings[] } | null> => {
    try {
        const bookingsSnapshot = await db.collection(restaurantCollectionName)
            .doc(restaurantId)
            .collection(bookingsCollectionName)
            .where('reservationNumber', '==', reservationNumber)
            .where("status", "==", "pending")
            .get()
        if (!bookingsSnapshot.empty) {
            const bookings = bookingsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Bookings[]
            return {
                data: bookings
            }
        } else {
            return null
        }
    } catch (error) {
        console.error('Error at findBookingByCustomerReservationNumber:', error)
        return null
    }
}

export const updateBookingProperties = async ({ restaurantId, bookingId, updates }: { restaurantId: string, bookingId: string, updates: Partial<Bookings> }): Promise<{ id: string, status: boolean }> => {
    try {
        const restaurantRef = db.collection(restaurantCollectionName).doc(restaurantId)
        const bookingRef = restaurantRef.collection(bookingsCollectionName).doc(bookingId)
        await bookingRef.update(updates)
        return {
            id: bookingId,
            status: true
        }
    } catch (error) {
        console.error("Error at updateBookingProperty:", error)
        return {
            id: "",
            status: false
        }
    }
}

export const addAvailability = async ({ availability, restaurantId }: { availability: Availability, restaurantId: string }): Promise<{ id: string, status: boolean }> => {
    try {
        const restaurantRef = db.collection(restaurantCollectionName).doc(restaurantId)
        const availabilityRef = restaurantRef.collection(availabilityCollectionName)
        const newAvailability = await availabilityRef.add(availability)
        return {
            id: newAvailability.id,
            status: true
        }
    } catch (error) {
        console.error('Error at addAvailability:', error)
        return {
            id: "",
            status: false
        }
    }
}
