import React, { useEffect, useState, useRef } from 'react';
import {
    Box,
    Container,
    Flex,
    Avatar,
    Text,
    Heading,
    Button,
    FormControl,
    FormLabel,
    Input,
    Textarea,
    useColorModeValue,
    VStack,
    HStack,
    SimpleGrid,
    Divider,
    useToast,
    Select,
    Tag,
    TagLabel,
    TagCloseButton,
    InputGroup,
    InputRightElement,
    IconButton,
} from '@chakra-ui/react';
import { FaUser, FaGraduationCap, FaEdit, FaSave, FaTimes, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { host } from '../../APIRoutes';

export default function ProfilePage() {
    const toast = useToast();
    const navigate = useNavigate();

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [newInterest, setNewInterest] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        branch: '',
        about: '',
        interests: [],
        image: null,
    });

    const fileInputRef = useRef(null);
    const bgColor = useColorModeValue('white', 'gray.800');
    const innerBgColor = useColorModeValue('white', 'gray.700');
    const textColor = useColorModeValue('gray.600', 'white');
    const secondaryBgColor = useColorModeValue('gray.50', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');

    useEffect(() => {
        // Get user data only once when component mounts
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData) {
            setUser(userData);
            setFormData({
                name: userData.name || '',
                email: userData.email || '',
                username: userData.username || '',
                branch: userData.branch || '',
                about: userData.about || '',
                interests: userData.interests || [],
                image: userData.image?.url || null,
            });

            if (userData.image?.url) {
                setPreviewImage(userData.image.url);
            }
        }
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);

            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleAddInterest = () => {
        if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
            setFormData(prev => ({
                ...prev,
                interests: [...prev.interests, newInterest.trim()]
            }));
            setNewInterest('');
        }
    };

    const handleRemoveInterest = (interest) => {
        setFormData(prev => ({
            ...prev,
            interests: prev.interests.filter(item => item !== interest)
        }));
    };

    const handleProfileUpdate = async () => {
        if (!user) return;

        setLoading(true);
        const data = new FormData();

        // Append all form fields
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('username', formData.username);
        data.append('branch', formData.branch);
        data.append('about', formData.about);

        // Append interests as JSON string
        data.append('interests', JSON.stringify(formData.interests));

        // Append image file if selected
        if (selectedFile) {
            data.append('image', selectedFile);
        }

        try {
            const response = await axios.patch(`${host}/update/${user._id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Update local user state and localStorage
            const updatedUser = response.data.user;
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            toast({
                title: "Profile Updated",
                description: response.data.message,
                status: "success",
                duration: 3000,
                isClosable: true,
            });

            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast({
                title: "Update Failed",
                description: error.response?.data?.message || "An error occurred while updating the profile.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    const cancelEditing = () => {
        if (!user) return;

        // Reset form data to original user values
        setFormData({
            name: user.name || '',
            email: user.email || '',
            username: user.username || '',
            branch: user.branch || '',
            about: user.about || '',
            interests: user.interests || [],
            image: user.image?.url || null,
        });

        // Reset preview image
        setPreviewImage(user.image?.url || null);
        setSelectedFile(null);

        // Exit edit mode
        setIsEditing(false);
    };

    // If user data is not yet loaded, show loading
    if (!user) {
        return (
            <Container maxW="container.lg" py={8} textAlign="center">
                <Text>Loading profile...</Text>
            </Container>
        );
    }

    return (
        <Container maxW="container.lg" py={8}>
            <Box bg={innerBgColor} p={6} rounded="xl" shadow="md" borderWidth="1px" borderColor={borderColor}>
                {/* Header with avatar and basic info */}
                <Flex direction={{ base: "column", md: "row" }} align={{ base: "center", md: "flex-start" }} mb={6}>
                    <Box position="relative" mr={{ base: 0, md: 6 }} mb={{ base: 4, md: 0 }}>
                        <Avatar
                            size="2xl"
                            name={formData.name}
                            src={previewImage}
                            border="2px solid"
                            borderColor="indigo.400"
                        />
                        {isEditing && (
                            <IconButton
                                aria-label="Change profile picture"
                                icon={<FaEdit />}
                                size="sm"
                                colorScheme="indigo"
                                position="absolute"
                                bottom="0"
                                right="0"
                                borderRadius="full"
                                onClick={() => fileInputRef.current.click()}
                            />
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={handleFileChange}
                            accept="image/png, image/jpeg, image/jpg"
                        />
                    </Box>

                    <Box flex="1">
                        <Heading size="xl" mb={1}>{formData.name}</Heading>
                        <Text fontSize="lg" color={textColor} mb={2}>@{formData.username}</Text>
                        <HStack spacing={4} mb={3}>
                            <Tag colorScheme="indigo" size="md">
                                <FaUser style={{ marginRight: '5px' }} />
                                {user.role}
                            </Tag>
                            {formData.branch && (
                                <Tag colorScheme="blue" size="md">
                                    <FaGraduationCap style={{ marginRight: '5px' }} />
                                    {formData.branch}
                                </Tag>
                            )}
                        </HStack>

                        <HStack spacing={4} mt={4}>
                            <Button
                                leftIcon={isEditing ? <FaTimes /> : <FaEdit />}
                                colorScheme={isEditing ? "red" : "indigo"}
                                className={isEditing ? "" : "!bg-indigo-500 !text-white"}
                                onClick={isEditing ? cancelEditing : () => setIsEditing(true)}
                            >
                                {isEditing ? "Cancel" : "Edit Profile"}
                            </Button>

                            {isEditing && (
                                <Button
                                    leftIcon={<FaSave />}
                                    colorScheme="green"
                                    className="!bg-green-500 !text-white"
                                    onClick={handleProfileUpdate}
                                    isLoading={loading}
                                    loadingText="Updating..."
                                >
                                    Save Changes
                                </Button>
                            )}
                        </HStack>
                    </Box>
                </Flex>

                <Divider my={6} />

                {/* Main content */}
                {isEditing ? (
                    <VStack spacing={6} align="stretch">
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl isRequired>
                                <FormLabel htmlFor="name">Full Name</FormLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    focusBorderColor="indigo.400"
                                />
                            </FormControl>

                            <FormControl isRequired>
                                <FormLabel htmlFor="username">Username</FormLabel>
                                <Input
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    focusBorderColor="indigo.400"
                                />
                            </FormControl>
                        </SimpleGrid>

                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl isRequired>
                                <FormLabel htmlFor="email">Email Address</FormLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    focusBorderColor="indigo.400"
                                />
                            </FormControl>

                            <FormControl>
                                <FormLabel htmlFor="branch">Branch/Specialization</FormLabel>
                                <Select
                                    id="branch"
                                    name="branch"
                                    value={formData.branch}
                                    onChange={handleInputChange}
                                    focusBorderColor="indigo.400"
                                    placeholder="Select your branch"
                                >
                                    <option value="Computer Science">Computer Science</option>
                                    <option value="Data Science">Data Science</option>
                                    <option value="Information Technology">Information Technology</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Mechanical">Mechanical</option>
                                    <option value="Civil">Civil</option>
                                    <option value="Other">Other</option>
                                </Select>
                            </FormControl>
                        </SimpleGrid>

                        <FormControl>
                            <FormLabel htmlFor="about">About Me</FormLabel>
                            <Textarea
                                id="about"
                                name="about"
                                value={formData.about}
                                onChange={handleInputChange}
                                placeholder="Share something about yourself..."
                                size="md"
                                focusBorderColor="indigo.400"
                                rows={4}
                            />
                        </FormControl>

                        <FormControl>
                            <FormLabel htmlFor="interests">Interests/Skills</FormLabel>
                            <InputGroup size="md">
                                <Input
                                    value={newInterest}
                                    onChange={(e) => setNewInterest(e.target.value)}
                                    placeholder="Add an interest or skill"
                                    onKeyPress={(e) => e.key === 'Enter' && handleAddInterest()}
                                    focusBorderColor="indigo.400"
                                />
                                <InputRightElement>
                                    <IconButton
                                        aria-label="Add interest"
                                        icon={<FaPlus />}
                                        size="sm"
                                        colorScheme="indigo"
                                        className="!bg-indigo-500 !text-white"
                                        onClick={handleAddInterest}
                                    />
                                </InputRightElement>
                            </InputGroup>

                            <Box mt={3}>
                                <HStack spacing={2} flexWrap="wrap">
                                    {formData.interests.map((interest, index) => (
                                        <Tag
                                            key={index}
                                            size="md"
                                            colorScheme="indigo"
                                            m={1}
                                        >
                                            <TagLabel>{interest}</TagLabel>
                                            <TagCloseButton onClick={() => handleRemoveInterest(interest)} />
                                        </Tag>
                                    ))}
                                </HStack>
                            </Box>
                        </FormControl>
                    </VStack>
                ) : (
                    <Box>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                            <Box p={4} bg={secondaryBgColor} rounded="md">
                                <Text fontWeight="semibold" mb={1}>Email</Text>
                                <Text>{formData.email}</Text>
                            </Box>

                            <Box p={4} bg={secondaryBgColor} rounded="md">
                                <Text fontWeight="semibold" mb={1}>Branch / Specialization</Text>
                                <Text>{formData.branch || "Not specified"}</Text>
                            </Box>
                        </SimpleGrid>

                        <Box mb={6}>
                            <Text fontWeight="semibold" fontSize="lg" mb={2}>About</Text>
                            <Box p={4} bg={secondaryBgColor} rounded="md">
                                <Text>{formData.about || "No information provided."}</Text>
                            </Box>
                        </Box>

                        <Box>
                            <Text fontWeight="semibold" fontSize="lg" mb={2}>Interests & Skills</Text>
                            <Box p={4} bg={secondaryBgColor} rounded="md">
                                {formData.interests && formData.interests.length > 0 ? (
                                    <HStack spacing={2} flexWrap="wrap">
                                        {formData.interests.map((interest, index) => (
                                            <Tag
                                                key={index}
                                                size="md"
                                                colorScheme="indigo"
                                                m={1}
                                            >
                                                <TagLabel>{interest}</TagLabel>
                                            </Tag>
                                        ))}
                                    </HStack>
                                ) : (
                                    <Text>No interests or skills added yet.</Text>
                                )}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </Container>
    );
}