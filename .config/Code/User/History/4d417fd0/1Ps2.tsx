"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MapPin,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  MessageSquare,
  PhoneCall,
  Calendar as CalendarIcon2,
} from "lucide-react";

// Mock data - replace with actual data fetching in a real application
const contacts = [
  {
    id: 1,
    type: "customer",
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 234 567 890",
    address: "123 Main St, City, Country",
    lastContact: "2023-06-01",
  },
  {
    id: 2,
    type: "patient",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 098 765 432",
    address: "456 Elm St, Town, Country",
    lastContact: "2023-06-05",
  },
  {
    id: 3,
    type: "provider",
    name: "Dr. Alice Johnson",
    email: "alice@example.com",
    phone: "+1 111 222 333",
    address: "789 Oak St, Village, Country",
    lastContact: "2023-06-10",
  },
  {
    id: 4,
    type: "customer",
    name: "Bob Wilson",
    email: "bob@example.com",
    phone: "+1 444 555 666",
    address: "321 Pine St, City, Country",
    lastContact: "2023-06-15",
  },
  {
    id: 5,
    type: "patient",
    name: "Emma Brown",
    email: "emma@example.com",
    phone: "+1 777 888 999",
    address: "654 Maple St, Town, Country",
    lastContact: "2023-06-20",
  },
] as const;

const activityLogs = [
  {
    id: 1,
    contactId: 1,
    type: "call",
    date: "2023-06-01",
    description: "Discussed new product launch",
  },
  {
    id: 2,
    contactId: 2,
    type: "message",
    date: "2023-06-05",
    description: "Sent prescription reminder",
  },
  {
    id: 3,
    contactId: 3,
    type: "meeting",
    date: "2023-06-10",
    description: "Quarterly review meeting",
  },
  {
    id: 4,
    contactId: 4,
    type: "email",
    date: "2023-06-15",
    description: "Sent promotional offer",
  },
  {
    id: 5,
    contactId: 5,
    type: "call",
    date: "2023-06-20",
    description: "Follow-up on treatment plan",
  },
];

export default function ContactManagement() {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedContact, setSelectedContact] = useState<
    (typeof contacts)[0] | null
  >(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContacts = contacts.filter(
    (contact) =>
      (activeTab === "all" || contact.type === activeTab) &&
      (contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone.includes(searchTerm)),
  );

  const handleContactSelect = (contact: (typeof contacts)[0]) => {
    setSelectedContact(contact);
  };

  return (
    <div className="container mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Contact Management</h1>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="space-y-6 lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="customer">Customers</TabsTrigger>
                  <TabsTrigger value="patient">Patients</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full">
                    <Plus className="mr-2 h-4 w-4" /> Add New Contact
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Contact</DialogTitle>
                    <DialogDescription>
                      Enter the details of the new contact below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input label="Name" id="name" className="w-full" />
                    <Input label="Email" id="email" className="w-full" />
                    <Input label="Phone" id="phone" className="w-full" />
                    <Input label="Address" id="address" className="w-full" />

                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="type" className="text-right">
                        Type
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select contact type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="customer">Customer</SelectItem>
                          <SelectItem value="patient">Patient</SelectItem>
                          <SelectItem value="provider">Provider</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit">Add Contact</Button>
                </DialogContent>
              </Dialog>
              <Button variant="outline" className="w-full">
                <Filter className="mr-2 h-4 w-4" /> Advanced Search
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:w-3/4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Contact List</CardTitle>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Last Contact</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredContacts.map((contact) => (
                      <TableRow
                        key={contact.id}
                        // @ts-expect-error server component
                        onClick={() => handleContactSelect(contact)}
                        className="cursor-pointer"
                      >
                        <TableCell className="font-medium">
                          {contact.name}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              contact.type === "customer"
                                ? "default"
                                : contact.type === "patient"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {contact.type}
                          </Badge>
                        </TableCell>
                        <TableCell>{contact.email}</TableCell>
                        <TableCell>{contact.phone}</TableCell>
                        <TableCell>{contact.lastContact}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>

          {selectedContact && (
            <Card>
              <CardHeader>
                <CardTitle>Contact Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedContact.name}`}
                      alt={selectedContact.name}
                    />
                    <AvatarFallback>
                      {selectedContact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedContact.name}
                    </h2>
                    <Badge
                      variant={
                        selectedContact.type === "customer"
                          ? "default"
                          : selectedContact.type === "patient"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {selectedContact.type}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4" />
                      <span>{selectedContact.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedContact.address}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Recent Activity</h3>
                    {activityLogs
                      .filter((log) => log.contactId === selectedContact.id)
                      .map((log) => (
                        <div
                          key={log.id}
                          className="flex items-center space-x-2"
                        >
                          {log.type === "call" && (
                            <PhoneCall className="h-4 w-4" />
                          )}
                          {log.type === "message" && (
                            <MessageSquare className="h-4 w-4" />
                          )}
                          {log.type === "meeting" && (
                            <CalendarIcon2 className="h-4 w-4" />
                          )}
                          {log.type === "email" && <Mail className="h-4 w-4" />}
                          <span>
                            {log.date}: {log.description}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add notes about this contact..."
                    />
                  </div>
                  <div>
                    <Label>Tags</Label>
                    <div className="mt-2 flex items-center space-x-2">
                      <Badge>VIP</Badge>
                      <Badge variant="outline">Frequent</Badge>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button>
                      <MessageSquare className="mr-2 h-4 w-4" /> Send Message
                    </Button>
                    <Button variant="outline">
                      <PhoneCall className="mr-2 h-4 w-4" /> Call
                    </Button>
                    <Button variant="outline">
                      <CalendarIcon2 className="mr-2 h-4 w-4" /> Schedule
                      Meeting
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
