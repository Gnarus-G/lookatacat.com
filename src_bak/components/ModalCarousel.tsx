import { Carousel } from "@mantine/carousel";
import { Modal, ModalProps, useMantineTheme } from "@mantine/core";

interface OverlayCarouselProps<T> extends ModalProps {
  source: T[];
  each: React.FC<T>;
  keySelector(each: T): string;
  currentKey?: number;
}

export default function ModalCarousel<T>({
  currentKey,
  keySelector,
  source,
  each,
  ...modaProps
}: OverlayCarouselProps<T>) {
  const theme = useMantineTheme();

  return (
    <Modal {...modaProps}>
      <Carousel
        sx={{ flex: 1 }}
        height="100%"
        slideSize="100%"
        slideGap="xs"
        dragFree
        initialSlide={currentKey}
        withIndicators
        styles={{
          control: {
            color: theme.white,
            borderColor: theme.primaryColor,
            backgroundImage: theme.fn.gradient(),
          },
          indicator: {
            color: theme.white,
            backgroundImage: theme.fn.gradient(),
          },
        }}
      >
        {source.map((s) => (
          <Carousel.Slide key={keySelector(s)}>{each(s)}</Carousel.Slide>
        ))}
      </Carousel>
    </Modal>
  );
}
