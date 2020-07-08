import React, { useState } from "react";
import {
  Box,
  Text,
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
import { motion, AnimateSharedLayout } from "framer-motion";

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
  stepId?: string;
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
  stepId,
}: StepTemplateProps) {
  return (
    <Box
      as={motion.article}
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.2, stiffness: 100 },
      }}
      layoutId={stepId}
      borderRadius="lg"
      bg="white"
      boxShadow="lg"
      px={6}
      py={6}
      w="100%"
      border="4px solid"
      borderColor={isActive ? "yellow.400" : "transparent"}
      mb="6"
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

interface YesNoStepProps extends StepProps {
  question: string;
}

function ConfirmStep(props: YesNoStepProps) {
  const [answer, setAnswer] = useState<string>("");

  function makeHandler(answer: string) {
    return () => {
      setAnswer(answer);
      props.next && props.next();
    };
  }

  return (
    <StepTemplate {...props}>
      {props.isActive ? (
        <>
          <Text fontWeight="bold">{props.question}</Text>
          <Stack direction="row">
            <Button
              colorScheme="red"
              onClick={makeHandler("That wasn't the problem")}
            >
              That wasn't the problem
            </Button>

            <Button as={RLink} to="/success" colorScheme="green">
              That was it!
            </Button>
          </Stack>
        </>
      ) : (
        <Box
          as={motion.div}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { x: 10 },
            show: {
              x: 0,
              transition: { delay: 0.3, delayChildren: 0.3, stiffness: 100 },
            },
          }}
        >
          <Text
            as={motion.p}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            fontWeight="bold"
          >
            {props.question}
          </Text>
          <Text
            as={motion.p}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            fontStyle="italic"
          >
            {answer}
          </Text>
        </Box>
      )}
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
            <FormLabel fontWeight="bold">{props.label}</FormLabel>
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
        <Box
          as={motion.div}
          initial="hidden"
          animate="show"
          variants={{
            hidden: { x: 10 },
            show: {
              x: 0,
              transition: { delay: 0.3, delayChildren: 0.3, stiffness: 100 },
            },
          }}
        >
          <Text
            as={motion.p}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            fontWeight="bold"
          >
            {props.label}
          </Text>
          <Text
            as={motion.p}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            fontStyle="italic"
          >
            {response}
          </Text>
        </Box>
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
      setCurrentStep((oldStep) => oldStep + 1);
    }, delay);
  }

  const newChildren = React.Children.map(children, (child, i) => {
    const props: StepProps = {
      next,
      isActive: i === currentStep,
      isLoading: loading && i === currentStep,
      stepId: i.toString(),
    };
    if (i > currentStep) return null;
    return React.cloneElement(child, props);
  });

  return (
    <Stack style={{ width: "100%" }}>
      <AnimateSharedLayout>{newChildren}</AnimateSharedLayout>
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
      <ConfirmStep question="Have you tried restarting the server/clearing caches/reinstalling dependencies?" />
      <TextAreaStep
        label="List out all the assumptions you've made"
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
