// const restaurantData = {
//     name: "Ristorante Vesuvio",
//     cuisine: "Neapolitan",
//     phone: "+390811234567",
//     address: {
//         street: "Via Toledo 256",
//         city: "Naples",
//         province: "Campania",
//         postalCode: "80132"
//     },
//     contactEmail: "info@ristorantevesuvio.it",
//     websiteUrl: "www.ristorantevesuvio.it",
//     operatingHours: {
//         Monday: {
//             lunch: { open: "12:00", close: "15:00" },
//             dinner: { open: "19:00", close: "23:30" }
//         },
//         Tuesday: {
//             lunch: { open: "12:00", close: "15:00" },
//             dinner: { open: "19:00", close: "23:30" }
//         },
//         Wednsday: {
//             lunch: { open: "12:00", close: "15:00" },
//             dinner: { open: "19:00", close: "23:30" }
//         },
//         Thursday: {
//             lunch: { open: "12:00", close: "15:00" },
//             dinner: { open: "19:00", close: "23:30" }
//         },
//         Friday: {
//             lunch: { open: "12:00", close: "15:00" },
//             dinner: { open: "19:00", close: "23:30" }
//         },
//         Saturday: {
//             lunch: { open: "12:00", close: "15:00" },
//             dinner: { open: "19:00", close: "23:30" }
//         },
//         Sunday: {
//             lunch: { open: "12:00", close: "15:00" },
//             dinner: { open: "19:00", close: "23:30" }
//         }
//     },
//     holidays: [
//         {
//             date: "25/12/2024",
//             reason: "Sample reason for the holiday."
//         },
//         {
//             date: "31/12/2024",
//             reason: "Sample reason for the holiday."
//         }
//     ],
//     specialEvents: [
//         {
//             date: "15/12/2024",
//             name: "Summer Seafood Festival",
//             description: "Special menu featuring Mediterranean seafood",
//             requiresReservation: true
//         }
//     ]
// }
// const bookings = [
//     {
//         customerName: "Marco Rossi",
//         customerEmail: "marco.rossi@example.com",
//         customerPhone: "+393334567890",
//         date: "02/11/2024",
//         startTime: "20:00",
//         endTime: "22:00",
//         duration: "2 H",
//         partySize: 4,
//         status: "confirmed",
//         specialRequests: "Vegetarian options needed"
//     },
//     {
//         customerName: "Raj Kapadia",
//         customerEmail: "rajkapadia@gamil.com",
//         customerPhone: "+393334567890",
//         date: "02/11/2024",
//         startTime: "18:00",
//         endTime: "20:00",
//         duration: "2 H",
//         partySize: 4,
//         status: "confirmed",
//         specialRequests: "Vegetarian options needed"
//     }
// ]

// const availability = [
//     {
//         date: "02/11/2024",
//         accpetAllDayReservation: {
//             status: false,
//             bookingStartTime: "12:00",
//             bookingEndTime: "21:00",
//             totalSeats: 50,
//             availableSeats: 30,
//         },
//         lunch: {
//             totalSeats: 50,
//             availableSeats: 30,
//             timeSlots: [
//                 { bookingStartTime: "11:00", bookingEndTime: "12:00", startTime: "12:00", endTime: "14:00", availableSeats: 30, duration: "2 H" },
//                 { bookingStartTime: "13:00", bookingEndTime: "14:00", startTime: "14:00", endTime: "16:00", availableSeats: 30, duration: "2 H" },
//             ]
//         },
//         dinner: {
//             totalSeats: 70,
//             availableSeats: 45,
//             timeSlots: [
//                 { bookingStartTime: "18:00", bookingEndTime: "19:00", startTime: "19:00", endTime: "21:00", availableSeats: 45, duration: "2 H" },
//                 { bookingStartTime: "20:00", bookingEndTime: "21:00", startTime: "21:00", endTime: "23:00", availableSeats: 45, duration: "2 H" },
//             ]
//         }
//     },
//     {
//         date: "03/11/2024",
//         accpetAllDayReservation: {
//             status: true,
//             bookingStartTime: "12:00",
//             bookingEndTime: "21:00",
//             totalSeats: 50,
//             availableSeats: 30,
//             duration: "2 H"
//         },
//         lunch: {
//             totalSeats: 50,
//             availableSeats: 30,
//             timeSlots: [
//                 { bookingStartTime: "11:00", bookingEndTime: "12:00", startTime: "12:00", endTime: "14:00", availableSeats: 30, duration: "2 H" },
//                 { bookingStartTime: "13:00", bookingEndTime: "14:00", startTime: "14:00", endTime: "16:00", availableSeats: 30, duration: "2 H" },
//             ]
//         },
//         dinner: {
//             totalSeats: 70,
//             availableSeats: 45,
//             timeSlots: [
//                 { bookingStartTime: "18:00", bookingEndTime: "19:00", startTime: "19:00", endTime: "21:00", availableSeats: 30, duration: "2 H" },
//                 { bookingStartTime: "20:00", bookingEndTime: "21:00", startTime: "21:00", endTime: "23:00", availableSeats: 30, duration: "2 H" },
//             ]
//         }
//     }
// ]

// import path from "path";

// import admin from "firebase-admin";

// const serviceAccountFilePath = path.join(__dirname, "../../my-project-23869-a63b96b66b51.json");
// const serviceAccount = require(serviceAccountFilePath);

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount)
// });

// const db = admin.firestore();

// const main = async () => {
//     const restaurantDoc = await db.collection("test_restaurants").add(restaurantData);
//     console.log(`Added restaurant ${restaurantDoc.id}`);

//     const restaurantRef = db.collection('test_restaurants').doc(restaurantDoc.id);

//     for (let index = 1; index < 30; index++) {
//         let day = ""
//         if (index < 10) {
//             day += `0${index}`
//         } else {
//             day += `${index}`
//         }

//         let element = {
//             date: `${day}/11/2024`,
//             accpetAllDayReservation: {
//                 status: true,
//                 bookingStartTime: "12:00",
//                 bookingEndTime: "21:00",
//                 totalSeats: 50,
//                 availableSeats: 30,
//                 duration: "2 H"
//             },
//             lunch: {
//                 totalSeats: 50,
//                 availableSeats: 30,
//                 timeSlots: [
//                     { bookingStartTime: "11:00", bookingEndTime: "12:00", startTime: "12:00", endTime: "14:00", availableSeats: 30, duration: "2 H" },
//                     { bookingStartTime: "13:00", bookingEndTime: "14:00", startTime: "14:00", endTime: "16:00", availableSeats: 30, duration: "2 H" },
//                 ]
//             },
//             dinner: {
//                 totalSeats: 70,
//                 availableSeats: 45,
//                 timeSlots: [
//                     { bookingStartTime: "18:00", bookingEndTime: "19:00", startTime: "19:00", endTime: "21:00", availableSeats: 30, duration: "2 H" },
//                     { bookingStartTime: "20:00", bookingEndTime: "21:00", startTime: "21:00", endTime: "23:00", availableSeats: 30, duration: "2 H" },
//                 ]
//             }
//         }
//         const availabilityDoc = await restaurantRef.collection("availability").add(element);
//         console.log(`Added availability ${availabilityDoc.id}`);
//     }

//     for (let index = 0; index < bookings.length; index++) {
//         let element = bookings[index];
//         const bokkingsDoc = await restaurantRef.collection("bookings").add(element);
//         console.log(`Added booking ${bokkingsDoc.id}`);
//     }
// };

// main();

import { findBookingsByRestaurantPhoneAndDate } from "../utils/firebaseFunctions";

findBookingsByRestaurantPhoneAndDate("+390811234567", "10/11/2024")
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err);
    });

// import { formatInTimeZone } from 'date-fns-tz';
// const currentDay = formatInTimeZone(new Date(), 'Europe/Rome', 'EEEE');
// console.log(currentDay);
