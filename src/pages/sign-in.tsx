import type { NextPage, GetServerSideProps } from "next";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import Image from "next/image";
import Button from "~/components/Button";
import TextInputField from "~/components/TextInputField/NonRefBorderedTextField";
import Head from "next/head";

const signInImageFullUrl = "/images/sign-in-page/desktop-full.png";

import triangleMask from "~/../public/images/landing-page/triangleMask.png";

const SignInPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Sign in | Arc </title>
      </Head>

      <div className="relative flex min-w-[320px] flex-1 overflow-hidden bg-arc">
        <div
          className="relative hidden flex-[35] lg:block"
          style={{
            backgroundImage: `url(${signInImageFullUrl})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "right",
          }}
        >
          <Image
            src={triangleMask}
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-0 z-10 hidden h-full max-w-[220px] md:block"
          />
        </div>

        <div className="z-10 flex flex-[29] flex-col px-4 py-[100px] pt-[2rem] sm:py-[100px] lg:pr-[100px]">
          <header className="flex justify-center lg:pt-[40px]">
            <div>
              <Image
                alt="Arc app logo"
                src="/images/arc-logo.svg"
                width={230}
                height={97}
                className="hidden lg:block"
              />

              <Image
                alt="Arc app logo"
                src="/images/mobile-logo.svg"
                width={96}
                height={96}
                className="block lg:hidden"
              />
            </div>
          </header>

          <section className="bg mt-12 flex flex-col items-center xs:mt-16 ">
            <div className="flex w-full max-w-[290px]">
              <SignInButton>
                <Button
                  buttonType="Primary"
                  className="flex w-full max-w-[290px] py-[10px]"
                >
                  <span className=" text-base">Sign in with Google </span>
                </Button>
              </SignInButton>
            </div>

            <span className="mt-5 text-black">or</span>

            <form
              action="#"
              className="mt-5 flex w-full max-w-[290px] flex-col gap-4 sm:gap-5"
            >
              <TextInputField label="Email" placeholder=" " />

              <TextInputField
                label="Password"
                placeholder=" "
                type="password"
              />

              <div className="flex justify-center">
                <Button
                  buttonType="Secondary"
                  className="w-full max-w-[290px] px-4 py-[10px]"
                >
                  <span className=" text-base"> Login </span>
                </Button>
              </div>
            </form>

            <div className="meta mt-6 flex flex-col items-center gap-4 text-primary-dark xs:gap-5">
              <a href="#" className="underline">
                Forgot Password?
              </a>

              <span>
                {`Don't have an account? `}
                <a href="#" className="underline">{`Create one`}</a>
              </span>
            </div>
          </section>
        </div>

        <div className="absolute bottom-0 h-[45vh] w-full md:hidden ">
          <img
            src={"/images/sign-in-page/mobile-new.svg"}
            alt="Sign In Artistic Hero Image"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);

  const user = userId ? await clerkClient.users.getUser(userId) : undefined;

  //Redirect to home if user is already logged in
  if (user) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  }

  return {
    props: {
      userId: userId ? userId : null,
    },
  };
};

export default SignInPage;
