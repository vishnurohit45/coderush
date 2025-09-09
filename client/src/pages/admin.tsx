import { Card, CardContent } from "@/components/ui/card";
import { Users, Car, TrendingUp, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { demandData, peakHours } from "@/lib/mock-data";
import type { AnalyticsData } from "@shared/schema";

export default function Admin() {
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ["/api/analytics"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="h-64 bg-muted rounded"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Admin Analytics</h1>
        <p className="text-muted-foreground">System insights and demand analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="shadow-sm" data-testid="card-active-students">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Students</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-active-students">
                  {analytics?.activeStudents?.toLocaleString() || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-testid="card-active-drivers-admin">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Car className="w-8 h-8 text-secondary" />
              <div>
                <p className="text-sm text-muted-foreground">Active Drivers</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-active-drivers-admin">
                  {analytics?.activeDrivers || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-testid="card-daily-rides-admin">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Daily Rides</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-daily-rides-admin">
                  {analytics?.dailyRides || "0"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-testid="card-revenue-today">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <DollarSign className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Revenue Today</p>
                <p className="text-2xl font-bold text-foreground" data-testid="text-revenue-today">
                  UGX {analytics?.totalRevenue ? Math.round(analytics.totalRevenue / 1000) : "0"}K
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Demand Heatmap */}
        <Card className="shadow-sm" data-testid="card-demand-heatmap">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Demand Heatmap</h3>
            <div className="space-y-3">
              <div className="grid grid-cols-4 gap-2 text-xs">
                {demandData.map((item, index) => (
                  <div
                    key={index}
                    className={`p-2 rounded text-center font-medium ${
                      item.color === 'green' ? 'bg-green-100 text-green-800' :
                      item.color === 'yellow' ? 'bg-yellow-100 text-yellow-800' :
                      item.color === 'red' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}
                    data-testid={`demand-${item.location.toLowerCase()}`}
                  >
                    {item.location}<br/>{item.level}
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                <span>Low Demand</span>
                <div className="flex space-x-1">
                  <div className="w-4 h-4 bg-blue-100 rounded"></div>
                  <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                  <div className="w-4 h-4 bg-green-100 rounded"></div>
                  <div className="w-4 h-4 bg-red-100 rounded"></div>
                </div>
                <span>High Demand</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Peak Time Prediction */}
        <Card className="shadow-sm" data-testid="card-peak-analysis">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Peak Time Analysis</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                {peakHours.map((period, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{period.time}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            period.color === 'red' ? 'bg-red-500' :
                            period.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                          }`}
                          style={{ width: `${period.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-foreground" data-testid={`peak-${index}`}>
                        {period.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                <p className="text-sm text-foreground font-medium">Recommendation:</p>
                <p className="text-xs text-muted-foreground">
                  Deploy additional autos during evening peak (5-7 PM) to meet demand.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Health */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="shadow-sm" data-testid="card-system-health">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">System Health</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Server Uptime</span>
                <span className="text-sm font-medium text-green-600" data-testid="text-uptime">99.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Avg. Response Time</span>
                <span className="text-sm font-medium text-foreground" data-testid="text-response-time">120ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Active Connections</span>
                <span className="text-sm font-medium text-foreground" data-testid="text-connections">
                  {analytics?.activeStudents ? Math.floor(analytics.activeStudents * 0.5) : "0"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Failed Bookings</span>
                <span className="text-sm font-medium text-red-600" data-testid="text-failed-bookings">0.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-testid="card-driver-performance">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Driver Performance</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Avg. Rating</span>
                <span className="text-sm font-medium text-green-600" data-testid="text-avg-rating">
                  {analytics?.avgRating || "0.0"}/5
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">On-Time Rate</span>
                <span className="text-sm font-medium text-green-600" data-testid="text-ontime-rate">94%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Cancellation Rate</span>
                <span className="text-sm font-medium text-yellow-600" data-testid="text-cancellation-rate">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Safety Incidents</span>
                <span className="text-sm font-medium text-green-600" data-testid="text-safety-incidents">0</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" data-testid="card-financial-summary">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Financial Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Today's Revenue</span>
                <span className="text-sm font-medium text-foreground" data-testid="text-today-revenue">
                  UGX {analytics?.totalRevenue ? Math.round(analytics.totalRevenue / 1000) : "0"}K
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Week's Revenue</span>
                <span className="text-sm font-medium text-foreground" data-testid="text-week-revenue">
                  UGX {analytics?.totalRevenue ? Math.round(analytics.totalRevenue * 7 / 1000) : "0"}K
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Driver Commissions</span>
                <span className="text-sm font-medium text-foreground" data-testid="text-commissions">
                  UGX {analytics?.totalRevenue ? Math.round(analytics.totalRevenue * 0.8 / 1000) : "0"}K
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-foreground">Platform Revenue</span>
                <span className="text-sm font-medium text-primary" data-testid="text-platform-revenue">
                  UGX {analytics?.totalRevenue ? Math.round(analytics.totalRevenue * 0.2 / 1000) : "0"}K
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
