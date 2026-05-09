package com.bourievents.dto;

import java.util.List;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStatsResponse {

    private long totalBookings;
    private long newBookings;
    private long inProgressBookings;
    private long confirmedBookings;
    private long cancelledBookings;
    private long totalClients;
    private long totalProviders;
    private String mostRequestedEventType;
    private Map<String, Long> bookingsByStatus;
    private Map<String, Long> bookingsByEventType;
    private List<BookingResponse> latestBookings;
}
