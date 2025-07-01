import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ListChecks, Scale, Bot, Users, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-headline text-3xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Evaluate, Compare, and Improve AI Models with Confidence
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              An open platform for benchmarking AI models on bias, reasoning, and safety. Get transparent, data-driven insights to choose the right model.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="container space-y-6 bg-slate-50 dark:bg-transparent py-8 md:py-12 lg:py-24">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-headline text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">Core Features</h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Our platform provides a comprehensive suite of tools for robust AI model evaluation.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <Card>
              <CardHeader>
                <ListChecks className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Standardized Prompts</CardTitle>
              </CardHeader>
              <CardContent>
                Test all models against a common set of prompts to ensure fair, apple-to-apples comparisons.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Scale className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Comprehensive Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                Evaluate models on multiple dimensions including bias, toxicity, factuality, and reasoning strength.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Human & AI Evaluation</CardTitle>
              </CardHeader>
              <CardContent>
                Combine automated scoring with nuanced human feedback for a holistic evaluation framework.
              </CardContent>
            </Card>
          </div>
        </section>
        
        <section className="container py-8 md:py-12 lg:py-24">
           <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-12">
            <h2 className="font-headline text-3xl leading-[1.1] sm:text-3xl md:text-5xl font-bold">How It Works</h2>
             <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              A simple, transparent, and powerful evaluation process.
            </p>
          </div>
          <div className="relative">
             <Image
                src="https://placehold.co/1200x400.png"
                alt="Dashboard Preview"
                width={1200}
                height={400}
                className="rounded-lg border shadow-lg"
                data-ai-hint="dashboard graph"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>
          </div>
          <div className="relative -mt-20 grid gap-8 md:grid-cols-3">
              <Card className="shadow-lg">
                  <CardHeader>
                      <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mr-4">1</div>
                          <CardTitle>Submit Prompt</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                      Select from a library of curated prompts designed to test specific model capabilities and failure modes.
                  </CardContent>
              </Card>
               <Card className="shadow-lg">
                  <CardHeader>
                      <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mr-4">2</div>
                          <CardTitle>Gather Outputs</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                      The platform feeds the prompt to multiple AI models and collects their generated responses.
                  </CardContent>
              </Card>
               <Card className="shadow-lg">
                  <CardHeader>
                      <div className="flex items-center">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl mr-4">3</div>
                          <CardTitle>Analyze Results</CardTitle>
                      </div>
                  </CardHeader>
                  <CardContent>
                      Outputs are scored by both AI and human evaluators. Compare results on the dashboard.
                  </CardContent>
              </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
