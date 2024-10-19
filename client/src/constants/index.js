import { IoIosCar } from "react-icons/io";
import { FaPersonMilitaryPointing } from "react-icons/fa6";
import { IoMdCalendar } from "react-icons/io";
import { MdTrain } from "react-icons/md";
import { IoSpeedometerOutline } from "react-icons/io5";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdRemoveCircleOutline } from "react-icons/io";

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

const vehicleAdminOptions = [
    {
        title: "All Vehicles",
        icon: IoIosCar,
    },
    {
        title: "Onboard New Vehicle",
        icon: IoMdAddCircleOutline,
    },
    {
        title: "Remove a Vehicle",
        icon: IoMdRemoveCircleOutline,
    }
]

const vehicleDisplayTitles = [
    "vehicle number",
    "driver name",
    "driver phone",
    "status",
    "current location",
    "vehicle type",
    "vehicle model",
]

export { adminNavOptionsFleet, adminNavOptionsData, vehicleAdminOptions, vehicleDisplayTitles };