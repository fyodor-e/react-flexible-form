"use client";
import { ChakraProvider } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import Iframe, { FrameContextConsumer } from "react-frame-component";

function memoize<T extends object, R>(func: (arg: T) => R): (arg: T) => R {
  const cache = new WeakMap<T, R>();
  return (arg: T) => {
    if (cache.has(arg)) return cache.get(arg)!;
    const ret = func(arg);
    cache.set(arg, ret);
    return ret;
  };
}

const createCacheFn = memoize((container: HTMLElement) =>
  createCache({ container, key: "frame" }),
);

const ChakraIframeProvider = (props: React.PropsWithChildren) => {
  const { children } = props;
  return (
    <Iframe
      style={{
        minHeight: "400px",
        width: "100%",
        border: "unset",
      }}
    >
      <FrameContextConsumer>
        {(frame) => {
          const head = frame.document?.head;
          if (!head) return null;
          return (
            <CacheProvider value={createCacheFn(head)}>
              {/* <EnvironmentProvider value={() => head.ownerDocument}> */}
              <ChakraProvider>{children}</ChakraProvider>
              {/* </EnvironmentProvider> */}
            </CacheProvider>
          );
        }}
      </FrameContextConsumer>
    </Iframe>
  );
};

export default ChakraIframeProvider;
