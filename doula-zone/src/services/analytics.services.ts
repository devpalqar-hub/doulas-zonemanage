import api from "./api";

export interface CardsStats {
    totalDoulas: number;
    totalDoulasChange: number;

    activeClients: number;
    activeClientsChange: number;

    todaysMeetings: number;
    todaysUpcoming: number;

    activeBookings: number;
    bookingsEndingSoon: number;

    pendingMeetings: number;
    pendingUrgent: number;
}

export const fetchUserCounts = async () => {
    const res = await api.get("/analytics/counts/active")
    return res.data.data;
}

export const fetchMeetingCounts = async () => {
    const res = await api.get("/analytics/counts/meeting");
    return res.data.data;
}

export const fetchBookingCounts = async () => {
    const res = await api.get("/analytics/counts/booking");
    return res.data.data.FormattedCounts;
}

export const fetchCardsStats = async (): Promise<CardsStats> => {
    const[userCounts, meetingCounts, bookingCounts] = await Promise.all([
        fetchUserCounts(),
        fetchMeetingCounts(),
        fetchBookingCounts(),
    ]);

  return {
    totalDoulas: userCounts.doulas ?? 0,
    totalDoulasChange: userCounts.doulasChange ?? 0,

    activeClients: userCounts.clients ?? 0,
    activeClientsChange: userCounts.clientsChange ?? 0,

    todaysMeetings: meetingCounts.TODAY ?? meetingCounts.SCHEDULED ?? 0,
    todaysUpcoming: meetingCounts.UPCOMING_TODAY ?? 0,

    activeBookings: bookingCounts.ACTIVE ?? 0,
    bookingsEndingSoon: bookingCounts.ENDING_SOON ?? 0,

    pendingMeetings: meetingCounts.SCHEDULED ?? 0,
    pendingUrgent: meetingCounts.URGENT ?? 0,
  };

}