import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Settings, Package, ShoppingCart, Info, X } from "lucide-react";

const notifications = [
  {
    id: 1,
    type: "low_stock",
    message: "Low stock alert: Paracetamol (500mg)",
    timestamp: "2023-06-15T10:30:00Z",
    acknowledged: false,
  },
  {
    id: 2,
    type: "order_status",
    message: "Order #1234 has been shipped",
    timestamp: "2023-06-14T14:45:00Z",
    acknowledged: true,
  },
  {
    id: 3,
    type: "system",
    message: "System maintenance scheduled for tonight at 2 AM",
    timestamp: "2023-06-13T09:00:00Z",
    acknowledged: false,
  },
  {
    id: 4,
    type: "low_stock",
    message: "Low stock alert: Amoxicillin (250mg)",
    timestamp: "2023-06-12T16:20:00Z",
    acknowledged: true,
  },
  {
    id: 5,
    type: "order_status",
    message: "New order #1235 received",
    timestamp: "2023-06-11T11:10:00Z",
    acknowledged: false,
  },
];

const notificationRules = [
  {
    id: 1,
    type: "low_stock",
    name: "Low Stock Alert",
    threshold: 50,
    enabled: true,
  },
  { id: 2, type: "order_status", name: "Order Status Changes", enabled: true },
  { id: 3, type: "system", name: "System Notifications", enabled: true },
  {
    id: 4,
    type: "expiry",
    name: "Expiry Date Alerts",
    threshold: 30,
    enabled: false,
  },
];

export default function NotificationSystem() {
  const [activeTab, setActiveTab] = useState("all");
  const [notificationPreferences, setNotificationPreferences] = useState({
    email: true,
    push: true,
    inApp: true,
  });

  const getIconForNotificationType = (type: string) => {
    const iconProps = "h-5 w-5";
    switch (type) {
      case "low_stock":
        return <Package className={`${iconProps} text-yellow-500`} />;
      case "order_status":
        return <ShoppingCart className={`${iconProps} text-blue-500`} />;
      case "system":
        return <Info className={`${iconProps} text-purple-500`} />;
      default:
        return <Bell className={`${iconProps} text-gray-500`} />;
    }
  };

  const filteredNotifications = notifications.filter(
    (notification) => activeTab === "all" || notification.type === activeTab,
  );

  return (
    <div className="container mx-auto space-y-8 bg-gray-100 p-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-4xl font-semibold text-gray-900">
          Notification Center
        </h1>
        <Button variant="outline" className="flex items-center">
          <Settings className="mr-2 h-5 w-5" /> Configure
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <Card className="shadow-lg md:col-span-2">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-4"
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="low_stock">Low Stock</TabsTrigger>
                <TabsTrigger value="order_status">Orders</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[450px] w-full space-y-4 rounded-md border bg-white p-4 shadow-inner">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start space-x-4 rounded-lg bg-gray-50 p-4 shadow-sm transition-shadow duration-150 hover:shadow-md"
                  >
                    {getIconForNotificationType(notification.type)}
                    <div className="flex-1 space-y-1">
                      <p className="text-md font-medium text-gray-800">
                        {notification.message}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span>
                          {new Date(notification.timestamp).toLocaleString()}
                        </span>
                        {notification.acknowledged ? (
                          <Badge variant="outline" className="ml-2">
                            Acknowledged
                          </Badge>
                        ) : (
                          <Button variant="ghost" size="sm" className="ml-2">
                            Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </Tabs>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {["email", "push", "inApp"].map((preference) => (
                  <div
                    key={preference}
                    className="flex items-center justify-between"
                  >
                    <Label
                      htmlFor={`${preference}-notifications`}
                      className="text-md"
                    >
                      {preference.charAt(0).toUpperCase() + preference.slice(1)}{" "}
                      Notifications
                    </Label>
                    <Switch
                      id={`${preference}-notifications`}
                      checked={
                        notificationPreferences[
                          preference as keyof typeof notificationPreferences
                        ]
                      }
                      onCheckedChange={(checked) =>
                        setNotificationPreferences((prev) => ({
                          ...prev,
                          [preference]: checked,
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Notification Rules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[250px] w-full rounded-md border bg-white p-4 shadow-inner">
                {notificationRules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox id={`rule-${rule.id}`} checked={rule.enabled} />
                      <Label htmlFor={`rule-${rule.id}`} className="text-md">
                        {rule.name}
                      </Label>
                    </div>
                    {rule.threshold && (
                      <Input
                        type="number"
                        value={rule.threshold}
                        className="w-24"
                        onChange={() => {
                          // Handle threshold change
                          console.log("Threshold changed");
                        }}
                      />
                    )}
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
