import { useState } from 'react';
import { Container, Heading, Button, VStack, Spinner, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td, FormControl, FormLabel, Input, Select } from '@chakra-ui/react';
import { useEvents, useAddEvent, useUpdateEvent, useDeleteEvent, useVenues } from '../integrations/supabase/index.js';

const Events = () => {
    const { data: events, isLoading: eventsLoading, error: eventsError } = useEvents();
    const { data: venues, isLoading: venuesLoading, error: venuesError } = useVenues();
    const addEventMutation = useAddEvent();
    const updateEventMutation = useUpdateEvent();
    const deleteEventMutation = useDeleteEvent();

    const [newEvent, setNewEvent] = useState({ name: '', date: '', venue: '' });
    const [editingEvent, setEditingEvent] = useState(null);

    const handleAddEvent = () => {
        addEventMutation.mutate(newEvent, {
            onSuccess: () => setNewEvent({ name: '', date: '', venue: '' }),
        });
    };

    const handleUpdateEvent = (event) => {
        updateEventMutation.mutate(event, {
            onSuccess: () => setEditingEvent(null),
        });
    };

    const handleDeleteEvent = (id) => {
        deleteEventMutation.mutate(id);
    };

    if (eventsLoading || venuesLoading) return <Spinner />;
    if (eventsError) return <Alert status="error"><AlertIcon />{eventsError.message}</Alert>;
    if (venuesError) return <Alert status="error"><AlertIcon />{venuesError.message}</Alert>;

    return (
        <Container>
            <Heading as="h1" mb={4}>Events</Heading>
            <VStack spacing={4} align="stretch">
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input value={newEvent.name} onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })} />
                </FormControl>
                <FormControl>
                    <FormLabel>Date</FormLabel>
                    <Input type="date" value={newEvent.date} onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })} />
                </FormControl>
                <FormControl>
                    <FormLabel>Venue</FormLabel>
                    <Select value={newEvent.venue} onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}>
                        <option value="">Select Venue</option>
                        {venues.map((venue) => (
                            <option key={venue.id} value={venue.id}>{venue.name}</option>
                        ))}
                    </Select>
                </FormControl>
                <Button onClick={handleAddEvent} isLoading={addEventMutation.isLoading}>Add Event</Button>
            </VStack>
            <Table mt={8}>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Date</Th>
                        <Th>Venue</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {events.map((event) => (
                        <Tr key={event.id}>
                            <Td>{event.name}</Td>
                            <Td>{event.date}</Td>
                            <Td>{venues.find((venue) => venue.id === event.venue)?.name}</Td>
                            <Td>
                                <Button size="sm" onClick={() => setEditingEvent(event)}>Edit</Button>
                                <Button size="sm" ml={2} onClick={() => handleDeleteEvent(event.id)} isLoading={deleteEventMutation.isLoading}>Delete</Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {editingEvent && (
                <VStack spacing={4} align="stretch" mt={8}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={editingEvent.name} onChange={(e) => setEditingEvent({ ...editingEvent, name: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Date</FormLabel>
                        <Input type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Venue</FormLabel>
                        <Select value={editingEvent.venue} onChange={(e) => setEditingEvent({ ...editingEvent, venue: e.target.value })}>
                            <option value="">Select Venue</option>
                            {venues.map((venue) => (
                                <option key={venue.id} value={venue.id}>{venue.name}</option>
                            ))}
                        </Select>
                    </FormControl>
                    <Button onClick={() => handleUpdateEvent(editingEvent)} isLoading={updateEventMutation.isLoading}>Update Event</Button>
                </VStack>
            )}
        </Container>
    );
};

export default Events;