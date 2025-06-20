import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Text,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  CircularProgress,
  CircularProgressLabel,
  Container,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import { CheckCircleIcon, WarningIcon, InfoIcon } from "@chakra-ui/icons";
import { host } from "../APIRoutes";

const PersonalizedRoadmap = ({ studentId, courseId }) => {
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chakra UI colors
  const headerBgGradient = "linear(to-r, blue.500, purple.500)";
  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const secondaryTextColor = useColorModeValue("gray.500", "gray.400");
  const footerBg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await axios.get(
          `${host}/roadmap/${courseId}/${studentId}`
        );
        console.log("personalised: ", response.data);

        setRoadmapData(response.data.roadmap);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch roadmap data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, [studentId, courseId]);

  const getPerformanceColor = (performance) => {
    if (performance >= 0.75) return "green.500";
    if (performance >= 0.5) return "orange.500";
    return "red.500";
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" height="300px">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" borderRadius="md" variant="subtle">
        <AlertIcon />
        <AlertTitle mr={2}>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!roadmapData) {
    return (
      <Alert status="warning" borderRadius="md" variant="subtle">
        <AlertIcon />
        <AlertDescription>No roadmap data is available yet.</AlertDescription>
      </Alert>
    );
  }

  const performanceColor = getPerformanceColor(roadmapData.performance);

  return (
    <Container maxW="container.lg" p={0}>
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        boxShadow="xl"
        bg={cardBg}
      >
        {/* Header */}
        <Box bgGradient={headerBgGradient} p={6} color="white">
          <Heading size="lg" mb={2}>
            Your Learning Roadmap
          </Heading>
          <Text opacity={0.9}>
            Personalized suggestions to enhance your learning journey
          </Text>
        </Box>

        {/* Performance Overview */}
        <Box p={6} borderBottomWidth="1px">
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="md" color={textColor}>
                Overall Performance
              </Heading>
              <Text color={secondaryTextColor} mt={1}>
                Based on your test results
              </Text>
            </Box>
            <CircularProgress
              value={roadmapData.performance * 100}
              color={performanceColor}
              size="100px"
              thickness="8px"
            >
              <CircularProgressLabel fontSize="lg" fontWeight="bold">
                {Math.round(roadmapData.performance * 100)}%
              </CircularProgressLabel>
            </CircularProgress>
          </Flex>
        </Box>

        {/* Module Suggestions */}
        <Box p={6}>
          <Heading size="md" color={textColor} mb={4}>
            Module Recommendations
          </Heading>

          <Accordion allowMultiple>
            {Object.entries(roadmapData.suggestions).map(
              ([moduleName, suggestions]) => (
                <AccordionItem
                  key={moduleName}
                  borderWidth="1px"
                  borderRadius="md"
                  mb={3}
                  borderColor={borderColor}
                >
                  <h2>
                    <AccordionButton py={4} _hover={{ bg: "gray.50" }}>
                      <Box
                        flex="1"
                        textAlign="left"
                        fontWeight="medium"
                        color={textColor}
                      >
                        <Flex align="center">
                          <InfoIcon color="blue.500" mr={2} />
                          {moduleName}
                        </Flex>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                  </h2>
                  <AccordionPanel pb={4} bg="gray.50">
                    <List spacing={3}>
                      {suggestions.map((suggestion, index) => (
                        <ListItem key={index} display="flex">
                          <ListIcon
                            as={CheckCircleIcon}
                            color="green.500"
                            mt={1}
                          />
                          <Text color={textColor}>{suggestion}</Text>
                        </ListItem>
                      ))}
                    </List>
                  </AccordionPanel>
                </AccordionItem>
              )
            )}
          </Accordion>
        </Box>

        {/* Footer */}
        <Box bg={footerBg} p={4} borderTopWidth="1px" textAlign="center">
          <Text color={secondaryTextColor} fontSize="sm">
            These suggestions are personalized based on your performance and
            learning patterns.
          </Text>
        </Box>
      </Box>
    </Container>
  );
};

export default PersonalizedRoadmap;
