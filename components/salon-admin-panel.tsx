"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, Phone } from "lucide-react"

type Service = {
  id: number
  name: string
  duration: number
  cost: number
}

type Appointment = {
  id: number
  date: Date
  clientName: string
  serviceName: string
}

export function SalonAdminPanelComponent() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [services, setServices] = useState<Service[]>([])
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [newService, setNewService] = useState({ name: "", duration: "", cost: "" })

  const handleAddService = (e: React.FormEvent) => {
    e.preventDefault()
    if (newService.name && newService.duration && newService.cost) {
      const service: Service = {
        id: Date.now(),
        name: newService.name,
        duration: parseInt(newService.duration),
        cost: parseFloat(newService.cost)
      }
      setServices([...services, service])
      setNewService({ name: "", duration: "", cost: "" })
    }
  }

  const handleAddAppointment = (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const clientName = (form.elements.namedItem("clientName") as HTMLInputElement).value
    const serviceName = (form.elements.namedItem("serviceName") as HTMLSelectElement).value
    if (date && clientName && serviceName) {
      const newAppointment: Appointment = {
        id: Date.now(),
        date: date,
        clientName,
        serviceName
      }
      setAppointments([...appointments, newAppointment])
      form.reset()
    }
  }

  const upcomingAppointments = appointments
    .filter((apt) => apt.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Salon Admin Panel</h1>
      <Tabs defaultValue="services">
        <TabsList className="mb-4">
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>
        <TabsContent value="services">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Service</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddService} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="serviceName">Service Name</Label>
                    <Input
                      id="serviceName"
                      value={newService.name}
                      onChange={(e) => setNewService({...newService, name: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceDuration">Duration (minutes)</Label>
                    <Input
                      id="serviceDuration"
                      type="number"
                      value={newService.duration}
                      onChange={(e) => setNewService({...newService, duration: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceCost">Cost ($)</Label>
                    <Input
                      id="serviceCost"
                      type="number"
                      step="0.01"
                      value={newService.cost}
                      onChange={(e) => setNewService({...newService, cost: e.target.value})}
                      required
                    />
                  </div>
                  <Button type="submit">Add Service</Button>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Service List</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {services.length > 0 ? (
                    <ul className="space-y-4">
                      {services.map((service) => (
                        <li key={service.id} className="border-b pb-2">
                          <p className="font-semibold">{service.name}</p>
                          <p>{service.duration} minutes</p>
                          <p>${service.cost.toFixed(2)}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No services added yet</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="appointments">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Add New Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddAppointment} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Client Name</Label>
                    <Input id="clientName" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="serviceName">Service</Label>
                    <select id="serviceName" className="w-full border rounded-md p-2" required>
                      {services.map((service) => (
                        <option key={service.id} value={service.name}>
                          {service.name} (${service.cost.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button type="submit">Add Appointment</Button>
                </form>
              </CardContent>
            </Card>
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                {upcomingAppointments.length > 0 ? (
                  <ul className="space-y-4">
                    {upcomingAppointments.map((apt) => (
                      <li key={apt.id} className="border-b pb-2">
                        <p className="font-semibold">{apt.clientName}</p>
                        <p>{apt.serviceName}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.date.toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No upcoming appointments</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5" />
                  <span>Email: salon@example.com</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-5 w-5" />
                  <span>Phone: (123) 456-7890</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}