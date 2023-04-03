import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaEnvelope, FaLock, FaUserNinja, FaUserSecret } from "react-icons/fa";
import SocialLogin from "./SocialLogin";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ISignUpError,
  ISignUpSuccess,
  ISignUpVariables,
  usernameSignUp,
} from "../api";

interface SignUpModal {
  isOpen: boolean;
  onClose: () => void;
}

interface ISignUpForm {
  name: string;
  email: string;
  username: string;
  password: string;
  extraError?: string;
}

export default function SignUpModal({ isOpen, onClose }: SignUpModal) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<ISignUpForm>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const mutation = useMutation<ISignUpSuccess, ISignUpError, ISignUpVariables>(
    usernameSignUp,
    {
      onSuccess: () => {
        toast({
          title: "Welcome!",
          status: "success",
          position: "top",
        });
        onClose();
        queryClient.refetchQueries(["me"]);
        reset();
      },
      onError: (error) => {
        toast({
          title: error.response.data.error,
          status: "error",
          position: "top",
          isClosable: true,
          variant: "subtle",
        });
      },
    }
  );
  const onSubmit = ({ name, email, username, password }: ISignUpForm) => {
    mutation.mutate({ name, email, username, password });
  };
  return (
    <Modal motionPreset="slideInBottom" onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign up</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.600">
                    <FaUserSecret />{" "}
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.name?.message)}
                {...register("name", { required: "Please wirte a name" })}
                variant={"filled"}
                placeholder="Name"
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.600">
                    <FaEnvelope />{" "}
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.email?.message)}
                {...register("email", {
                  required: "Please write an email",
                  validate: (value) => {
                    if (!value.includes("@") || !value.includes(".")) {
                      return "Please follow the email format";
                    }
                  },
                })}
                variant={"filled"}
                placeholder="Email"
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.600">
                    <FaUserNinja />{" "}
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.username?.message)}
                {...register("username", {
                  required: "Please write a username",
                })}
                variant={"filled"}
                placeholder="Username"
              />
            </InputGroup>
            {errors.email ? (
              <Box w="100%">
                <Text color="red.500">{errors.email.message}</Text>
              </Box>
            ) : null}
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.600">
                    <FaLock />
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.password?.message)}
                {...register("password", {
                  required: "Please write a password",
                })}
                variant={"filled"}
                placeholder="Password"
                type={"password"}
              />
            </InputGroup>
          </VStack>
          <Button type="submit" mt={4} colorScheme={"red"} w="100%">
            Sign up
          </Button>
          <SocialLogin />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
