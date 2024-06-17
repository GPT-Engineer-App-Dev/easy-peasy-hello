import { useState } from 'react';
import { Container, Heading, Button, VStack, Spinner, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { useVenues, useAddVenue, useUpdateVenue, useDeleteVenue } from '../integrations/supabase/index.js';

const Venues = () => {
    const { data: venues, isLoading, error } = useVenues();
    const addVenueMutation = useAddVenue();
    const updateVenueMutation = useUpdateVenue();
    const deleteVenueMutation = useDeleteVenue();

    const [newVenue, setNewVenue] = useState({ name: '', capacity: '', type: '' });
    const [editingVenue, setEditingVenue] = useState(null);

    const handleAddVenue = () => {
        addVenueMutation.mutate(newVenue, {
            onSuccess: () => setNewVenue({ name: '', capacity: '', type: '' }),
        });
    };

    const handleUpdateVenue = (venue) => {
        updateVenueMutation.mutate(venue, {
            onSuccess: () => setEditingVenue(null),
        });
    };

    const handleDeleteVenue = (id) => {
        deleteVenueMutation.mutate(id);
    };

    if (isLoading) return <Spinner />;
    if (error) return <Alert status="error"><AlertIcon />{error.message}</Alert>;

    return (
        <Container>
            <Heading as="h1" mb={4}>Venues</Heading>
            <VStack spacing={4} align="stretch">
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input value={newVenue.name} onChange={(e) => setNewVenue({ ...newVenue, name: e.target.value })} />
                </FormControl>
                <FormControl>
                    <FormLabel>Capacity</FormLabel>
                    <Input type="number" value={newVenue.capacity} onChange={(e) => setNewVenue({ ...newVenue, capacity: e.target.value })} />
                </FormControl>
                <FormControl>
                    <FormLabel>Type</FormLabel>
                    <Input value={newVenue.type} onChange={(e) => setNewVenue({ ...newVenue, type: e.target.value })} />
                </FormControl>
                <Button onClick={handleAddVenue} isLoading={addVenueMutation.isLoading}>Add Venue</Button>
            </VStack>
            <Table mt={8}>
                <Thead>
                    <Tr>
                        <Th>Name</Th>
                        <Th>Capacity</Th>
                        <Th>Type</Th>
                        <Th>Actions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {venues.map((venue) => (
                        <Tr key={venue.id}>
                            <Td>{venue.name}</Td>
                            <Td>{venue.capacity}</Td>
                            <Td>{venue.type}</Td>
                            <Td>
                                <Button size="sm" onClick={() => setEditingVenue(venue)}>Edit</Button>
                                <Button size="sm" ml={2} onClick={() => handleDeleteVenue(venue.id)} isLoading={deleteVenueMutation.isLoading}>Delete</Button>
                            </Td>
                        </Tr>
                    ))}
                </Tbody>
            </Table>
            {editingVenue && (
                <VStack spacing={4} align="stretch" mt={8}>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input value={editingVenue.name} onChange={(e) => setEditingVenue({ ...editingVenue, name: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Capacity</FormLabel>
                        <Input type="number" value={editingVenue.capacity} onChange={(e) => setEditingVenue({ ...editingVenue, capacity: e.target.value })} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Type</FormLabel>
                        <Input value={editingVenue.type} onChange={(e) => setEditingVenue({ ...editingVenue, type: e.target.value })} />
                    </FormControl>
                    <Button onClick={() => handleUpdateVenue(editingVenue)} isLoading={updateVenueMutation.isLoading}>Update Venue</Button>
                </VStack>
            )}
        </Container>
    );
};

export default Venues;