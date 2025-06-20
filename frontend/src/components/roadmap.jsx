import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  useToast,
  Text,
  Circle,
  HStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Input,
  AspectRatio,
  Flex,
  Badge,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Grid,
  Divider,
  Card,
  CardBody,
  CardHeader,
  Stack,
  StackDivider,
  Heading,
  Icon,
  Progress,
  Tooltip,
  chakra,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { host } from "../APIRoutes";
import {
  FaVideo,
  FaBookOpen,
  FaLaptopCode,
  FaRegFileAlt,
  FaQuestion,
} from "react-icons/fa";

function Roadmap({ roadmap, user }) {
  const [activeModule, setActiveModule] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadingTo, setUploadingTo] = useState({
    moduleIndex: null,
    contentIndex: null,
  });
  const fileInputRef = useRef(null);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const accentColor = useColorModeValue("teal.500", "teal.300");
  const cardBg = useColorModeValue("white", "gray.800");
  const headerBg = useColorModeValue("teal.50", "teal.900");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  const getContentIcon = (contentType) => {
    switch (contentType) {
      case "video":
        return <Icon as={FaVideo} color={accentColor} boxSize={5} />;
      case "note":
        return <Icon as={FaBookOpen} color={accentColor} boxSize={5} />;
      case "practice":
        return <Icon as={FaLaptopCode} color={accentColor} boxSize={5} />;
      default:
        return <Icon as={FaRegFileAlt} color={accentColor} boxSize={5} />;
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      console.log("Selected file:", selectedFile);
    } else {
      console.log("No file selected.");
    }
  };

  const handleUploadContent = (moduleIndex, contentIndex) => {
    setUploadingTo({ moduleIndex, contentIndex });
    fileInputRef.current.click();
  };

  const handleFileSubmit = async (moduleId, contentIndex) => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("content", file);

    try {
      const response = await axios.post(
        `${host}/teacher/course/roadmap/${id}/content`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            roadmapid: moduleId,
            contentIndex: contentIndex,
          },
        }
      );

      if (response.data.success) {
        toast({
          title: "File uploaded successfully",
          description: response.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        console.log("File uploaded successfully:", response.data);
        setFile(null);
        setUploadingTo({ moduleIndex: null, contentIndex: null });
        fileInputRef.current.value = null;
      }
    } catch (error) {
      toast({
        title: "Error uploading file",
        description:
          error.response?.data?.message ||
          "There was an error uploading the file.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      console.error("Error uploading file:", error);
    }
  };

  const handleTakeQuiz = (id, idx) => {
    navigate(`/home/quiz/${id}/${idx}`);
  };

  const handleGenerateQuiz = async (idx) => {
    try {
      const response = await axios.post(
        `${host}/teacher/course/get-course/${id}/${idx}`,
        {
          withCredentials: true,
        }
      );
      if (response.data.success) {
        console.log("Quiz generated:", response.data);
        toast({
          title: `Success`,
          description: `Quiz generated successfully`,
          status: `success`,
          duration: 9000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("Error generating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      
      <Input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        display="none"
      />

      <Accordion allowToggle>
        {roadmap.map((module, moduleIndex) => (
          <AccordionItem
            key={moduleIndex}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            mb={4}
            boxShadow="sm"
            transition="all 0.3s"
            _hover={{ boxShadow: "md" }}
            onClick={() => setActiveModule(moduleIndex)}
          >
            <AccordionButton
              _expanded={{ bg: headerBg, color: "gray.800" }}
              className="!bg-indigo-200"
              p={4}
              borderRadius="lg"
            >
              <HStack spacing={4} w="full">
                <Circle
                  size="36px"
                  className="!bg-indigo-600"
                  color="white"
                  fontWeight="bold"
                >
                  {module.order}
                </Circle>
                <Box flex="1" textAlign="left">
                  <Text fontWeight="bold" fontSize="lg">
                    {module.title}
                  </Text>
                  <Text fontSize="sm" color="gray.600" mt={1} noOfLines={1}>
                    {module.description}
                  </Text>
                </Box>
                <Badge fontSize="0.8em" px={2}>
                  {module.contents.length} items
                </Badge>
              </HStack>
              <AccordionIcon boxSize={6} />
            </AccordionButton>

            <AccordionPanel pb={6} px={6}>
              <Text mb={4} color="gray.700">
                {module.description}
              </Text>

              <Tabs variant="enclosed" mt={4}>
                <TabList>
                  <Tab className="!bg-indigo-300 !text-black">
                    <Icon as={FaRegFileAlt} mr={2} /> Content
                  </Tab>
                  <Tab className="!bg-indigo-300 !text-black">
                    <Icon as={FaQuestion} mr={2} /> Quiz
                  </Tab>
                </TabList>

                <TabPanels>
                  <TabPanel p={4}>
                    {module.contents.length > 0 ? (
                      <VStack spacing={4} align="stretch">
                        {module.contents.map((content, contentIndex) => (
                          <Card
                            key={contentIndex}
                            bg={cardBg}
                            borderRadius="md"
                            boxShadow="sm"
                            transition="all 0.2s"
                            _hover={{
                              boxShadow: "md",
                              transform: "translateY(-2px)",
                            }}
                          >
                            <CardHeader className="!bg-indigo-100" py={3} px={4}>
                              <HStack>
                                {getContentIcon(content.type)}
                                <Text fontWeight="medium">{content.title}</Text>
                                <Badge
                                  ml="auto"
                                  colorScheme={
                                    content.type === "video"
                                      ? "blue"
                                      : content.type === "note"
                                        ? "green"
                                        : content.type === "practice"
                                          ? "purple"
                                          : "gray"
                                  }
                                >
                                  {content.type}
                                </Badge>
                              </HStack>
                            </CardHeader>

                            <CardBody>
                              <Stack divider={<StackDivider />} spacing={4}>
                                <Box>
                                  <Text fontSize="sm" mb={2}>
                                    {content.description}
                                  </Text>

                                  {content.tags.length > 0 && (
                                    <HStack mt={2} wrap="wrap">
                                      {content.tags.map((tag, idx) => (
                                        <Badge
                                          key={idx}
                                          className="!bg-indigo-300"
                                          mr={1}
                                          mb={1}
                                        >
                                          {tag}
                                        </Badge>
                                      ))}
                                    </HStack>
                                  )}
                                </Box>

                                {content.resource && content.resource.url ? (
                                  content.type === "video" ? (
                                    <AspectRatio ratio={16 / 9} maxW="full">
                                      <iframe
                                        title={content.title}
                                        src={content.resource.url}
                                        allowFullScreen
                                      />
                                    </AspectRatio>
                                  ) : (
                                    <Box
                                      as="a"
                                      href={content.resource.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      p={3}
                                      borderRadius="md"
                                      className="!bg-indigo-100"
                                      _hover={{
                                        textDecoration: "none",
                                        bg: "gray.100",
                                      }}
                                    >
                                      <HStack>
                                        <Icon as={FaRegFileAlt} />
                                        <Text>Open resource</Text>
                                      </HStack>
                                    </Box>
                                  )
                                ) : (
                                  <Box p={3}
                                    className="!bg-indigo-300" borderRadius="md">
                                    <Text color="gray.500" fontSize="sm">
                                      No resource available
                                    </Text>
                                  </Box>
                                )}

                                {user.role === "Teacher" && (
                                  <HStack spacing={2}>
                                    <Button
                                      size="sm"

                                      className="!bg-indigo-600 !text-white"
                                      onClick={() =>
                                        handleUploadContent(
                                          moduleIndex,
                                          contentIndex
                                        )
                                      }
                                    >
                                      Upload Content
                                    </Button>
                                    {file &&
                                      uploadingTo.moduleIndex === moduleIndex &&
                                      uploadingTo.contentIndex ===
                                      contentIndex && (
                                        <Button
                                          size="sm"
                                          colorScheme="blue"
                                          onClick={() =>
                                            handleFileSubmit(
                                              module._id,
                                              contentIndex
                                            )
                                          }
                                        >
                                          Submit
                                        </Button>
                                      )}
                                  </HStack>
                                )}
                              </Stack>
                            </CardBody>
                          </Card>
                        ))}
                      </VStack>
                    ) : (
                      <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={6}
                        textAlign="center"
                        bg="gray.50"
                      >
                        <Text color="gray.500">
                          No content available in this module
                        </Text>
                      </Box>
                    )}
                  </TabPanel>

                  <TabPanel p={4}>
                    {module.quiz &&
                      module.quiz.questions &&
                      module.quiz.questions.length > 0 ? (
                      <Box>
                        <Button

                          className="!bg-indigo-600 !text-white"
                          variant="solid"
                          onClick={() => handleTakeQuiz(id, moduleIndex)}
                          mb={4}
                        >
                          {user.role === "Teacher" ? "View Quiz" : "Take Quiz"}
                        </Button>
                      </Box>
                    ) : (
                      <Box
                        borderWidth="1px"
                        borderRadius="lg"
                        p={6}
                        textAlign="center"
                        bg="gray.50"
                        mb={4}
                      >
                        <Text color="gray.500">
                          No quiz questions available for this module
                        </Text>
                      </Box>
                    )}

                    {/* Always show the AI Generate Quiz button for teachers */}
                    {user.role === "Teacher" && (
                      <Button
                        className="bg-indigo-300"
                        variant="outline"
                        onClick={() => handleGenerateQuiz(moduleIndex)}
                        mt={4}
                      >
                        AI Generate Quiz
                      </Button>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}

export default Roadmap;
