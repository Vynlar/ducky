import React, { useMemo, useState } from "react";
import {
  Box,
  Text,
  Alert,
  AlertProps,
  AlertIcon,
  Icon,
  Flex,
  Stack,
  FormHelperText,
  Spinner,
  FormControl,
  FormLabel,
  Button,
  Textarea,
  keyframes,
} from "@chakra-ui/core";
import { Link as RLink } from "react-router-dom";
import { AiOutlineSmile } from "react-icons/ai";

const fadeIn = keyframes({
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
});

function* cyclicSequence<T>(options: T[]): Generator<T, T, T> {
  while (true) {
    for (const option of options) {
      yield option;
    }
  }
}

interface Stage {
  label: string;
  helper: string;
  alert?: {
    text: string;
    status: AlertProps["status"];
  };
}

function Wizard() {
  const [loading, setLoading] = useState(false);
  const [submitCount, setSubmitCount] = useState(0);

  const promptGenerator = useMemo(
    () =>
      cyclicSequence<Stage>([
        {
          label: "Briefly describe the problem you're having",
          helper: "Tip: Don't over think it!",
        },
        {
          label:
            "Have you tried restarting the server/clearing caches/reinstalling dependencies?",
          helper: "This gets me pretty often!",
          alert: {
            text: "Oops! I remembered something else I need!",
            status: "warning",
          },
        },
        {
          label: "List out all the assumptions you've made.",
          helper: "Tip: Do you best to write down everything you can think of.",
          alert: {
            text: "Looks like we need some more info from you",
            status: "info",
          },
        },
        {
          label: "Which assumptions do you know are true?",
          helper:
            "Tip: Pay extra attention to the ones you think are most obvious!",
          alert: {
            text: "Oops! I remembered something else I need!",
            status: "warning",
          },
        },
        {
          label: "Where else could the problem be that you haven't looked yet?",
          helper: "Idea: Perhaps a configuration or environment issue?",
          alert: {
            text: "Hmmm. Let's shift gears and give this a try.",
            status: "info",
          },
        },
      ]),
    []
  );
  const initialPrompt = useMemo(() => {
    return promptGenerator.next().value;
  }, [promptGenerator]);
  const [prompt, setPrompt] = useState(initialPrompt);

  function handleSubmit() {
    setLoading(true);
    setSubmitCount((prev) => prev + 1);
    setPrompt(promptGenerator.next().value);

    let delay =
      Math.random() < 0.2
        ? Math.random() * 2000 + 2000
        : Math.random() * 700 + 500;

    setTimeout(() => {
      setLoading(false);
    }, delay);
  }

  return (
    <Box
      as="article"
      borderRadius="lg"
      bg="white"
      boxShadow="lg"
      px={6}
      py={6}
      w="100%"
    >
      {loading ? (
        <Flex
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          height="48"
          color="yellow.500"
        >
          <Spinner mx="auto" size="lg" mb="2" />
          <Text animation={`${fadeIn} 0.2s 1s both`}>
            It's taking longer than usual...
          </Text>
        </Flex>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing="4">
            {submitCount > 0 && prompt.alert && (
              <Alert status={prompt.alert.status}>
                <AlertIcon />
                {prompt.alert.text}
              </Alert>
            )}

            <FormControl id="test">
              <FormLabel>{prompt.label}</FormLabel>
              <Textarea name="step1" borderColor="gray.500" minH="200px" />
              <FormHelperText>
                {prompt.helper}{" "}
                <Icon color="yellow.600" fontSize="24px" as={AiOutlineSmile} />
              </FormHelperText>
            </FormControl>

            <Stack
              direction={["column", "row"]}
              spacing="4"
              justifyContent="flex-end"
              alignItems="stretch"
              w="100%"
            >
              <Button
                as={RLink}
                to="/success"
                variant="ghost"
                colorScheme="yellow"
              >
                Oh! I figured it out!
              </Button>

              <Button colorScheme="yellow" w={["auto", 40]} type="submit">
                Solve
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </Box>
  );
}

export default Wizard;
