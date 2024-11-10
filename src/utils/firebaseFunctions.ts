import path from "path";

import admin from "firebase-admin";
import { Availability, Bookings, DetectIntentResponse, Restaurant } from "./objectTypes";
import { Request } from "express";

const serviceAccountFilePath = path.join(__dirname, "../../my-project-23869-a63b96b66b51.json");
const serviceAccount = require(serviceAccountFilePath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const restaurantCollectionName = "test_restaurants";
const bookingsCollectionName = "bookings";
const availabilityCollectionName = "availability";
const waitingListCollectionName = "waitingList";
const callbackRequestsCollectionName = "callbackRequests";
const customersCollectionName = "customers";

export const findRestaurantByPhone = async (phone: string): Promise<{ data: Restaurant, id: string } | null> => {
    const restaurantSnapshot = await db.collection(restaurantCollectionName).where("phone", "==", phone).limit(1).get();
    if (!restaurantSnapshot.empty) {
        const restaurant = restaurantSnapshot.docs[0].data() as Restaurant;
        return {
            data: restaurant,
            id: restaurantSnapshot.docs[0].id
        };
    }
    return null;
};

export const findAvailabilityByRestaurantPhoneAndDate = async (phone: string, date: string): Promise<{ data: Availability, id: string } | null> => {
    const restaurantSnapshot = await db.collection(restaurantCollectionName).where("phone", "==", phone).limit(1).get();
    if (!restaurantSnapshot.empty) {
        const restaurant = restaurantSnapshot.docs[0];
        const availabilitySnapshot = await db.collection(restaurantCollectionName)
            .doc(restaurant.id)
            .collection(availabilityCollectionName)
            .where('date', '==', date)
            .limit(1)
            .get();
        if (!availabilitySnapshot.empty) {
            const restaurant = availabilitySnapshot.docs[0].data() as Availability;
            return {
                data: restaurant,
                id: availabilitySnapshot.docs[0].id
            };
        } else {
            return null;
        }
    }
    return null;
};

export const findBookingsByRestaurantPhoneAndDate = async (phone: string, date: string): Promise<{ data: Bookings[] } | null> => {
    const restaurantSnapshot = await db.collection(restaurantCollectionName).where("phone", "==", phone).limit(1).get();
    if (!restaurantSnapshot.empty) {
        const restaurant = restaurantSnapshot.docs[0];
        const bookingsSnapshot = await db.collection(restaurantCollectionName)
            .doc(restaurant.id)
            .collection(bookingsCollectionName)
            .where('date', '==', date)
            .get();
        if (!bookingsSnapshot.empty) {
            const bookingsSnapshot = await db.collection(restaurantCollectionName)
                .doc(restaurant.id)
                .collection(bookingsCollectionName)
                .where('date', '==', date)
                .get();
            if (!bookingsSnapshot.empty) {
                const bookings = bookingsSnapshot.docs.map(doc => ({
                    ...doc.data()
                })) as Bookings[];

                return {
                    data: bookings
                };
            } else {
                return null;
            }
        } else {
            return null;
        }
    }
    return null;
}

const saveToBookings = async (request: Request) => {
    try {
        const detectIntentResponse = request.body as DetectIntentResponse;
        const parameters = detectIntentResponse.sessionInfo.parameters;
        const restaurantSnapshot = await db.collection(restaurantCollectionName)
            .where('phone', '==', '+390811234567')
            .limit(1)
            .get();

        if (!restaurantSnapshot.empty) {
            const restaurantDoc = restaurantSnapshot.docs[0];
            const bookingsRef = restaurantDoc.ref.collection(bookingsCollectionName);
            const day = parameters.date.day;
            const month = parameters.date.month;
            const year = parameters.date.year;
            const hours = parameters.time.hours;
            const minutes = parameters.time.minutes;
            const date = new Date(`${day}/${month + 1}/${year}`).toLocaleDateString("en-US", { day: '2-digit', month: '2-digit', year: 'numeric', timeZone: 'Europe/Rome' });
            const time = new Date(Date.UTC(year, month + 1, day, hours, minutes, 0)).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Europe/Rome' });
            let newReservation: Bookings = {
                customerEmail: parameters.email,
                customerName: parameters.name.name,
                customerPhone: parameters.phone,
                date: date,
                duration: "2 H",
                endTime: time,
                partySize: parameters.number_of_people,
                specialRequests: "No",
                startTime: time,
                status: "pending"
            };
            await bookingsRef.add(newReservation);
            console.log('Booking data saved successfully!');
        } else {
            console.log('No restaurant found with the given phone number.');
        }
    } catch (error) {
        console.error('Error saving booking data:', error);
    }
};
