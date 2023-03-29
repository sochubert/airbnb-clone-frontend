import { Button, Heading, Text, VStack } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <VStack bg="gray.200" justifyContent={"center"} minH="100vh">
      <Heading>Page not found.</Heading>
      <Text>It seems that you're lost.</Text>
      <Link to={"/"}>
        <Button colorScheme={"red"} variant={"link"}>
          Go Home &rarr;
        </Button>
      </Link>
    </VStack>
  );
}
