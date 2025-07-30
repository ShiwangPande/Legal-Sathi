'use client';

import { useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from 'framer-motion';

const workImages = [
  "https://res.cloudinary.com/dqv4mucxh/image/upload/v1753881314/IMG-20250730-WA0008_g6miji.jpg",
  "https://res.cloudinary.com/dqv4mucxh/image/upload/v1753881313/IMG-20250730-WA0009_jod3b2.jpg",
  "https://res.cloudinary.com/dqv4mucxh/image/upload/v1753881314/IMG-20250730-WA0007_reln7x.jpg",
  "https://res.cloudinary.com/dqv4mucxh/image/upload/v1753881313/IMG-20250730-WA0004_ztg9oe.jpg",
  "https://res.cloudinary.com/dqv4mucxh/image/upload/v1753881313/IMG-20250730-WA0005_blsffn.jpg",
  "https://res.cloudinary.com/dqv4mucxh/image/upload/v1753881313/IMG-20250730-WA0006_tmvo0y.jpg",
  "https://res.cloudinary.com/dqv4mucxh/image/upload/v1753881313/IMG-20250730-WA0003_yb7zmt.jpg",
];

export default function OurWorkGallery() {
  const [modalIdx, setModalIdx] = useState<number|null>(null);

  return (
    <section className="w-full py-16 px-2 md:px-0 bg-background text-foreground">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <motion.h2
          className="text-3xl md:text-4xl font-bold mb-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Our Work
        </motion.h2>
        <motion.p
          className="text-lg text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          A showcase of our impact and projects
        </motion.p>
      </div>
      <div className="relative max-w-4xl mx-auto">
        <Carousel opts={{ align: "start", loop: true }} className="w-full">
          <CarouselPrevious className="-left-4 md:-left-8" />
          <CarouselNext className="-right-4 md:-right-8" />
          <CarouselContent>
            {workImages.map((img, i) => (
              <CarouselItem key={i} className="sm:basis-1/2 md:basis-1/3 px-2">
                <Card className="h-full flex items-center justify-center overflow-hidden shadow-lg bg-card/80 dark:bg-card/60 transition-colors cursor-pointer">
                  <CardContent className="flex items-center justify-center p-0 w-full h-64 md:h-72">
                    <img
                      src={img}
                      alt={`Work example ${i + 1}`}
                      className="object-cover w-full h-full rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onClick={() => setModalIdx(i)}
                    />
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
      <AnimatePresence>
        {modalIdx !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setModalIdx(null)}
          >
            <motion.img
              src={workImages[modalIdx]}
              alt={`Work example ${modalIdx + 1}`}
              className="max-w-[90vw] max-h-[80vh] rounded-xl shadow-2xl border-4 border-white"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
} 