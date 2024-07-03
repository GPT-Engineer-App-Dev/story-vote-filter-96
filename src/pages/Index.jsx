import React, { useEffect, useState } from "react";
import { Container, Text, VStack, Input, Box, Link, Flex } from "@chakra-ui/react";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  useEffect(() => {
    fetchTopStories();
  }, []);

  useEffect(() => {
    filterStories();
  }, [searchTerm, stories]);

  const fetchTopStories = async () => {
    try {
      const response = await fetch("https://hacker-news.firebaseio.com/v0/topstories.json");
      const storyIds = await response.json();
      const top5StoryIds = storyIds.slice(0, 5);
      const storyPromises = top5StoryIds.map(id =>
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(res => res.json())
      );
      const stories = await Promise.all(storyPromises);
      setStories(stories);
      setFilteredStories(stories);
    } catch (error) {
      console.error("Error fetching top stories:", error);
    }
  };

  const filterStories = () => {
    const filtered = stories.filter(story =>
      story.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStories(filtered);
  };

  return (
    <Container centerContent maxW="container.md" py={8} px={4}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl" fontWeight="bold" color="teal.700">Top 5 Hacker News Stories</Text>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          borderRadius="md"
          boxShadow="sm"
        />
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%" bg="white" boxShadow="md" mb={4}>
            <Text fontSize="lg" fontWeight="bold">{story.title}</Text>
            <Link href={story.url} color="teal.500" isExternal _hover={{ textDecoration: "underline", color: "teal.700" }}>Read more</Link>
            <Text>Upvotes: {story.score}</Text>
          </Box>
        ))}
      </VStack>
      <Flex as="footer" width="100%" py={4} justifyContent="space-between" alignItems="center" borderTop="1px solid #eaeaea" mt={8}>
        <Text fontSize="sm" color="gray.500">© 2023 Your Company. All rights reserved.</Text>
        <Link href="mailto:contact@yourcompany.com" fontSize="sm" color="teal.500" _hover={{ textDecoration: "underline", color: "teal.700" }}>Contact Us</Link>
      </Flex>
    </Container>
  );
};

export default Index;