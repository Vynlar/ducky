import React, { useMemo, useState } from "react";
import {
  Box,
  Text,
  Alert,
  AlertProps,
  AlertIcon,
  VisuallyHidden,
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

interface StepProps {
  next?: () => void;
  isActive?: boolean;
  isLoading?: boolean;
}

interface StepFooterProps {
  isValid?: boolean;
}

function StepFooter({ isValid }: StepFooterProps) {
  return (
    <Stack
      direction={["column", "row"]}
      spacing="4"
      justifyContent="flex-end"
      alignItems="stretch"
      w="100%"
    >
      <Button as={RLink} to="/success" variant="ghost" colorScheme="yellow">
        Oh! I figured it out!
      </Button>

      <Button
        isDisabled={!isValid}
        colorScheme="yellow"
        w={["auto", 40]}
        type="submit"
      >
        Solve
      </Button>
    </Stack>
  );
}

interface StepTemplateProps extends StepProps {
  children: React.ReactNode;
}
function StepTemplate({
  children,
  next,
  isActive,
  isLoading,
}: StepTemplateProps) {
  return (
    <Box
      as="article"
      borderRadius="lg"
      bg="white"
      boxShadow="lg"
      px={6}
      py={6}
      w="100%"
      border="4px solid"
      borderColor={isActive ? "yellow.400" : "transparent"}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          next && next();
        }}
      >
        {isLoading && <Loading />}
        <Stack spacing="4" d={isLoading ? "none" : "flex"}>
          {children}
        </Stack>
      </form>
    </Box>
  );
}

function FinalStep(props: StepProps) {
  return (
    <StepTemplate {...props}>
      <Text fontWeight="bold">I'm all fresh out of ideas :(</Text>
      <Text>Would you like to restart?</Text>
      <Button as={RLink} to="/" colorScheme="yellow" px={6}>
        Restart
      </Button>
    </StepTemplate>
  );
}

interface TextAreaStepProps extends StepProps {
  label: string;
  helper: string;
}

function TextAreaStep(props: TextAreaStepProps) {
  const [response, setResponse] = useState("");

  return (
    <StepTemplate {...props}>
      {props.isActive ? (
        <>
          <FormControl>
            <FormLabel>{props.label}</FormLabel>
            <Textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              borderColor="gray.500"
              minH="200px"
            />
            <FormHelperText>
              {props.helper}{" "}
              <Icon color="yellow.500" fontSize="24px" as={AiOutlineSmile} />
            </FormHelperText>
          </FormControl>

          <StepFooter isValid={!!response} />
        </>
      ) : (
        <>
          <Text fontWeight="bold">{props.label}:</Text>
          <Text fontStyle="italic">{response}</Text>
        </>
      )}
    </StepTemplate>
  );
}

interface StepsProps {
  children: React.ReactElement[];
}

function Steps({ children }: StepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);

  function next() {
    setLoading(true);
    let delay =
      Math.random() < 0.2
        ? Math.random() * 2000 + 2000
        : Math.random() * 700 + 500;

    setTimeout(() => {
      setLoading(false);
      setCurrentStep((old) => old + 1);
    }, delay);
  }

  const newChildren = React.Children.map(children, (child, i) => {
    const props: StepProps = {
      next,
      isActive: i === currentStep,
      isLoading: loading && i === currentStep,
    };
    if (i > currentStep) return null;
    return React.cloneElement(child, props);
  });

  return (
    <Stack w="100%" spacing="6">
      {newChildren}
    </Stack>
  );
}

function Loading() {
  return (
    <Flex
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="48"
      color="yellow.500"
      w="100%"
    >
      <Spinner mx="auto" size="lg" mb="2" />
      <Text animation={`${fadeIn} 0.2s 1s both`}>
        It's taking longer than usual...
      </Text>
    </Flex>
  );
}

function Wizard() {
  return (
    <Steps>
      <TextAreaStep
        label="Briefly describe the problem you're having"
        helper="Tip: Don't over think it"
      />
      <TextAreaStep
        label="Have you tried restarting the server/clearing caches/reinstalling dependencies?"
        helper="This gets me pretty often!"
      />
      <TextAreaStep
        label="List out all the assumptions you've made."
        helper="Tip: Do you best to write down everything you can think of."
      />
      <TextAreaStep
        label="Which assumptions do you know are true?"
        helper="Tip: Pay extra attention to the ones you think are most obvious!"
      />
      <TextAreaStep
        label="Where else could the problem be that you haven't looked yet?"
        helper="Idea: Perhaps a configuration or environment issue?"
      />
      <FinalStep />
    </Steps>
  );
}

export default Wizard;
