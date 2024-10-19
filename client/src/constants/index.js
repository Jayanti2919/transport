import { IoIosCar } from "react-icons/io";
import { FaPersonMilitaryPointing } from "react-icons/fa6";
import { IoMdCalendar } from "react-icons/io";
import { MdTrain } from "react-icons/md";
import { IoSpeedometerOutline } from "react-icons/io5";

const adminNavOptionsFleet = [
    {
        title: "Available Vehicles",
        icon: IoIosCar,
        link: "/admin/availableVehicles",
    },
    {
        title: "Driver Activity",
        icon: FaPersonMilitaryPointing,
        link: "/admin/driverActivity",
    },
    {
        title: "Booking Data",
        icon: IoMdCalendar,
        link: "/admin/bookingData",
    },
]

const adminNavOptionsData = [
    {
        title: "Trip Analytics",
        icon: MdTrain,
        link: "/admin/tripAnalytics",
    },
    {
        title: "Driver Performance",
        icon: IoSpeedometerOutline,
        link: "/admin/driverPerformance",
    },
]

export { adminNavOptionsFleet, adminNavOptionsData }