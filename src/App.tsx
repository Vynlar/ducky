import React from "react";
import { Link as RLink, BrowserRouter, Switch, Route } from "react-router-dom";
import { Flex, Text, Box, Stack, Heading, Button } from "@chakra-ui/core";
import Wizard from "./wizard";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Box w="100vw" minH="100vh" bg="yellow.100" pt={10}>
          <Stack maxW="container.md" mx="auto" spacing="6" px="4">
            <RLink to="/">
              <Heading as="h1" d="flex" alignItems="baseline" px={6}>
                <Box
                  as="span"
                  transform="skew(-8deg)"
                  mr="2"
                  _hover={{ textDecoration: "underline" }}
                >
                  ducky
                </Box>
                <Box as="span" transform="skew(-8deg)" fontSize="md">
                  intelligent debugging engine
                </Box>
              </Heading>
            </RLink>

            <Switch>
              <Route path="/debug">
                <Wizard />
              </Route>

              <Route path="/success">
                <Stack
                  borderRadius="lg"
                  bg="white"
                  p="6"
                  w="100%"
                  alignItems="center"
                  spacing="6"
                  boxShadow="lg"
                >
                  <Heading as="h2">Awesome!</Heading>
                  <Text>
                    Thank you for using{" "}
                    <Text as="span" fontWeight="bold">
                      ducky
                    </Text>
                    , the intelligent debugging engine
                  </Text>
                  <Button as={RLink} to="/debug" colorScheme="yellow">
                    Solve another problem
                  </Button>
                  <Button as={RLink} to="/" variant="link" colorScheme="yellow">
                    Return Home
                  </Button>
                </Stack>
              </Route>

              <Route path="*">
                <Stack
                  borderRadius="lg"
                  boxShadow="lg"
                  bg="white"
                  p="6"
                  spacing="6"
                  w="100%"
                >
                  <Heading as="h2" size="2xl">
                    Ducky finds your
                    <br /> toughest bugs
                  </Heading>

                  <Text maxW="340px">
                    Use our patented
                    <Text as="span" color="gray.400">
                      *
                    </Text>{" "}
                    tool to get personalized help on your problem.
                  </Text>

                  <Flex
                    alignItems="flex-end"
                    justifyContent="space-between"
                    flexWrap="wrap"
                    w="100%"
                  >
                    <Button
                      as={RLink}
                      to="/debug"
                      colorScheme="yellow"
                      px={["6", "10"]}
                    >
                      Find my bug
                    </Button>

                    <Text fontSize="sm" color="gray.300">
                      * not actually patented
                    </Text>
                  </Flex>
                </Stack>
              </Route>
            </Switch>
          </Stack>
        </Box>
      </div>
    </BrowserRouter>
  );
}

export default App;
