'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: 'Promod Kumar Yadav',
    location: 'Patna, Bihar',
    text: 'आठ घंटे का काम करके सिर्फ ₹४००० मिलते थे, वो भी दो-दो हफ़्ते लेट। लीगल साथी की ऑडियो सुनी और मालिक से सीधा बात की। अब ₹७००० वक़्त पर मिलता है।',
    rating: 5,
  },
  {
    name: 'Pooja Sharma',
    location: 'Jaipur, Rajasthan',
    text: 'कारखाने में रोज़ १०-१२ घंटे काम होता था, पर तनख्वाह में overtime का एक रुपया नहीं। लीगल साथी से जाना कि मज़दूरों के भी अधिकार होते हैं। अब हर घंटे का हिसाब है।',
    rating: 5,
  },
  {
    name: 'Debashis Roy',
    location: 'Kolkata, West Bengal',
    text: 'আগে বেশি সময় কাজ করলেও, টাকা কম দিত। মালিক বলতো অ্যাডজাস্ট করো। লিগ্যাল সাথী বলেছে, আইন অনুযায়ী ওভারটাইম এর টাকাও পাওয়ার অধিকার আছে। আমি এখন চুপ করি না।',
    rating: 5,
  },
  {
    name: 'Kishore Patil',
    location: 'Pune, Maharashtra',
    text: 'They deducted PF every month but never showed any receipt. Legal Saathi helped me check the UAN portal. Turns out, they hadn\'t deposited for 8 months. Now I keep full record.',
    rating: 5,
  },
  {
    name: 'Nagraj Shetty',
    location: 'Whitefield, Bangalore',
    text: 'ಪಿಎಫ್ ಕಟ್ ಮಾಡ್ತಾ ಇದ್ದರು ಆದರೆ ಕಂಪನಿಯವರು ಹಣ ಜಮೆ ಮಾಡ್ತಿರ್ಲಿಲ್ಲ. ಲೀಗಲ್ ಸಾಥಿಯಿಂದ ತಿಳಿದು ಆಫೀಸ್ನವರ ಬಳಿ ಕೇಳಿದೆ. ಈಗ ಎಲ್ಲವೂ ಸರಿಯಾಗಿ ಜಮೆ ಆಗ್ತಾ ಇದೆ.',
    rating: 5,
  },
  {
    name: 'Rakesh Mondal',
    location: 'Howrah, West Bengal',
    text: 'মাইনের কাগজে PF কাটা হত, কিন্তু কোনও সময়ই জমা হত না। লিগ্যাল সাথী আমাকে শেখাল কিভাবে নিজে চেক করতে হয়। আমি এখন সবাইকে শেখাই।',
    rating: 5,
  },
  {
    name: 'Rekha Narsimhan',
    location: 'Indiranagar, Bangalore',
    text: 'ನೋವು ಇದ್ದರೂ ಅವರು ಹಕ್ಕಿಲ್ಲದ ಕೆಲಸಗಳಿಗೆ ಕಳಿಸುತ್ತಿದ್ದರು. ಲೀಗಲ್ ಸಾಥಿಯಿಂದ ನನಗೆ ಹಕ್ಕುಗಳ ಅರಿವು ಆಯ್ತು. ಈಗ ಬೋನಸ್ ₹3000 ಸಿಕ್ಕಿದೆ, ಮೊದಲ ಬಾರಿಗೆ.',
    rating: 5,
  },
  {
    name: 'Anjali Rani',
    location: 'Haryana',
    text: 'They kept saying I was just a trainee so no salary. Legal Saathi explained the exploitation. I raised it with HR. Got paid for 3 months in one go.',
    rating: 5,
  },
  {
    name: 'Pooja Devi',
    location: 'Jaipur, Rajasthan',
    text: 'हर महीने ₹५०० तनख्वाह से कटते थे, कोई वजह नहीं बताई जाती थी। लीगल साथी ने बताया कि बिना लिखित मंज़ूरी के पैसा काटना गलत है। अब हर पैसा वापस मिल रहा है।',
    rating: 5,
  },
  {
    name: 'Gurtej Singh',
    location: 'Delhi',
    text: 'ਮੈਂ ਕੰਮ ਕਰਦਾ ਸੀ ਬਿਨਾਂ ਕਿਸੇ ਕਾਗਜ਼ ਦੇ। ਕੋਈ ਲਿਖਤੀ ਗੱਲ ਨਹੀਂ। ਲੀਗਲ ਸਾਥੀ ਤੋਂ ਪਤਾ ਲੱਗਾ ਕਿ ਇਹ ਸਾਰੇ ਕੰਟ੍ਰੈਕਟ ਜ਼ਰੂਰੀ ਹੁੰਦੇ ਨੇ। ਹੁਣ ਮੇਰੇ ਕੋਲ ਲਿਖਤੀ ਕੌਂਟ੍ਰੈਕਟ ਵੀ ਹੈ, ਛੁੱਟੀ ਵੀ ਮਿਲਦੀ ਏ।',
    rating: 5,
  },
  {
    name: 'Iqbal Singh',
    location: 'Amritsar, Punjab',
    text: 'ਮੈਂ ਇੱਕ ਮੀਨੇ ਤਕ ਕੰਮ ਕੀਤਾ ਤੇ ਮਾਲਕ ਨੇ ਕਿਹਾ ਸੈਂਪਲ ਪੀਰੀਅਡ ਸੀ, ਤਨਖ਼ਾਹ ਨਹੀਂ ਮਿਲੇਗੀ। ਲੀਗਲ ਸਾਥੀ ਨੇ ਦੱਸਿਆ ਇਹ ਗੈਰਕਾਨੂੰਨੀ ਏ। ਹੁਣ ਪੂਰੀ ਤਨਖ਼ਾਹ ਮਿਲੀ ਤੇ ਨਵੀਂ ਨੌਕਰੀ ਵੀ।',
    rating: 5,
  },
  {
    name: 'Mahaveer Prajapat',
    location: 'Ajmer Road, Jaipur',
    text: "काम करते वक्त हाथ जल गया। मालिक ने बोला – 'अपने पैसे से इलाज कराओ'। लीगल साथी ने बताया कि कम्पनी को मुआवज़ा देना ही पड़ेगा। मैंने लड़ाई की, ₹३५०० मिला।",
    rating: 5,
  },
  {
    name: 'Ravi Kanhaiya',
    location: 'Baroda, Gujarat',
    text: 'મારી પત્ની કામ પર ગઈ અને રજાની માગ કરી તો બહાનાઓથી ના પાડી. લીગલ સાથી થકી સમજાયું કે પ્રસૂતિ રજા દરેક મહિલાનો અધિકાર છે. હવે બિનધસ્તક પર રજા પણ મળી રહી છે.',
    rating: 5,
  },
  {
    name: 'Mahadevi Bai',
    location: 'Bangalore, Karnataka',
    text: 'ಮನೆಯಲ್ಲಿ ಕೆಲಸ ಮಾಡ್ತಾ ಇದ್ದಾಗ ಬೋನಸ್ ಬೇಡ ಅಂತ ಹೇಳ್ತಿದ್ದರು. ಲೀಗಲ್ ಸಾಥಿಯಿಂದ ನನಗೆ ಹಕ್ಕುಗಳ ಅರಿವು ಆಯ್ತು. ಈಗ ಬೋನಸ್ ₹3000 ಸಿಕ್ಕಿದೆ, ಮೊದಲ ಬಾರಿಗೆ.',
    rating: 5,
  },
  {
    name: 'Sandeep Chaurasia',
    location: 'Ayodhya, Uttar Pradesh',
    text: 'They didn\'t give me an offer letter even after 6 months. Legal Saathi explained I could be denied benefits without it. I raised it. Got contract, ID, and proper salary breakup.',
    rating: 5,
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5 mt-2">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground'}`}
          fill={i < rating ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={i < rating ? 0 : 1.5}
          viewBox="0 0 24 24"
        >
          <polygon points="12 17.27 18.18 21 16.54 13.97 22 9.24 14.81 8.63 12 2 9.19 8.63 2 9.24 7.46 13.97 5.82 21 12 17.27" />
        </svg>
      ))}
    </div>
  );
}

function UserAvatar({ name }: { name: string }) {
  return (
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg shadow-lg border-2 border-white">
      {name.split(' ').map(n => n[0]).join('').toUpperCase()}
    </div>
  );
}

export default function Testimonials() {
  // Flipping card state for the second section
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const handlePrev = () => {
    setFlipped(false);
    setCurrent((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  const handleNext = () => {
    setFlipped(false);
    setCurrent((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Modern Carousel Testimonials */}
      <section className="w-full py-16 px-2 md:px-0 bg-background text-foreground">
        <div className="max-w-3xl mx-auto text-center mb-10">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            What Our Sathis Say
          </motion.h2>
          <motion.p
            className="text-lg text-muted-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Real stories from people we've helped
          </motion.p>
        </div>
        <div className="relative max-w-4xl mx-auto">
          <Carousel opts={{ align: 'start', loop: true }} className="w-full">
            <CarouselPrevious className="-left-4 md:-left-8" />
            <CarouselNext className="-right-4 md:-right-8" />
            <CarouselContent>
              {testimonials.map((t, i) => (
                <CarouselItem key={i} className="sm:basis-1/2 md:basis-1/3 px-2">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="h-full flex flex-col items-center justify-between shadow-lg bg-card/80 dark:bg-card/60 transition-colors">
                      <CardHeader className="flex flex-col items-center gap-2 pb-2">
                        <div className="mb-2">
                          <UserAvatar name={t.name} />
                        </div>
                        <CardTitle className="text-lg text-center leading-tight">
                          {t.name}
                        </CardTitle>
                        <CardDescription className="text-xs text-center">
                          {t.location}
                        </CardDescription>
                        <StarRating rating={t.rating} />
                      </CardHeader>
                      <CardContent className="flex-1 flex flex-col justify-between items-center px-4 pb-4">
                        <p className="text-base text-center mb-4">"{t.text}"</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Flipping Card Testimonials (previous version, for comparison) */}
      <section className="w-full py-8 px-2 md:px-0 bg-background text-foreground">
        <div className="max-w-xl mx-auto text-center mb-6">
          <motion.h3
            className="text-2xl md:text-3xl font-bold mb-2"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Featured Testimonial
          </motion.h3>
        </div>
        <div className="relative flex items-center justify-center max-w-md mx-auto">
          <button
            className="absolute left-0 z-10 bg-card/80 dark:bg-card/60 rounded-full p-2 shadow hover:bg-accent transition"
            onClick={handlePrev}
            aria-label="Previous"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="w-80 h-96 flex items-center justify-center cursor-pointer select-none" onClick={() => setFlipped((f) => !f)}>
            <motion.div
              className="relative w-full h-full"
              style={{ perspective: 1200 }}
            >
              {/* Front Side */}
              <motion.div
                className="absolute w-full h-full rounded-xl shadow-lg bg-card/80 dark:bg-card/60 flex flex-col items-center justify-center overflow-hidden"
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.6 }}
                style={{ backfaceVisibility: 'hidden' }}
              >
                <div className="mt-8 mb-4">
                  <UserAvatar name={testimonials[current].name} />
                </div>
                <div className="text-xl font-semibold mb-1">{testimonials[current].name}</div>
                <div className="text-sm text-muted-foreground mb-4">{testimonials[current].location}</div>
                <div className="text-xs text-muted-foreground mt-auto mb-6">Click to flip</div>
              </motion.div>
              {/* Back Side */}
              <motion.div
                className="absolute w-full h-full rounded-xl shadow-lg bg-card/80 dark:bg-card/60 flex items-center justify-center px-6 text-lg font-medium text-center"
                animate={{ rotateY: flipped ? 0 : -180 }}
                transition={{ duration: 0.6 }}
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                {testimonials[current].text}
              </motion.div>
            </motion.div>
          </div>
          <button
            className="absolute right-0 z-10 bg-card/80 dark:bg-card/60 rounded-full p-2 shadow hover:bg-accent transition"
            onClick={handleNext}
            aria-label="Next"
          >
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
        <div className="flex justify-center mt-4 gap-2">
          {testimonials.map((_, idx) => (
            <span
              key={idx}
              className={`inline-block w-2 h-2 rounded-full ${idx === current ? 'bg-primary' : 'bg-muted-foreground/30'}`}
            />
          ))}
        </div>
      </section>
    </>
  );
} 