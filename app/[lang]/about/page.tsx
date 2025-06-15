"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ArrowLeft, Users, Award, Heart, Mail, Linkedin, Twitter, Instagram, Globe, Phone } from "lucide-react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface Founder {
  id: number;
  name: string;
  title: string;
  bio: string;
  imageUrl?: string;
  languageCode: string;
  email?: string;
  contactNumber?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  team: string;
  languageCode: string;
  email?: string;
  contactNumber?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

interface Acknowledgement {
  id: number;
  name: string;
  contribution: string;
  imageUrl?: string;
  languageCode: string;
}

export default function AboutPage() {
  const params = useParams();
  const [founders, setFounders] = useState<Founder[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [acknowledgements, setAcknowledgements] = useState<Acknowledgement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("founders");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null);
        const currentLang = params.lang as string;

        if (!currentLang) {
          throw new Error("Language code is required");
        }

        const [foundersRes, teamRes, acknowledgementsRes] = await Promise.all([
          fetch(`/api/admin/about/founder?languageCode=${currentLang}`),
          fetch(`/api/admin/about/team?languageCode=${currentLang}`),
          fetch(`/api/admin/about/acknowledgement?languageCode=${currentLang}`)
        ]);

        if (!foundersRes.ok || !teamRes.ok || !acknowledgementsRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [foundersData, teamData, acknowledgementsData] = await Promise.all([
          foundersRes.json(),
          teamRes.json(),
          acknowledgementsRes.json()
        ]);

        // Log the founders data to check social links
        console.log('Founders data in frontend:', JSON.stringify(foundersData, null, 2));

        setFounders(foundersData);
        setTeamMembers(teamData);
        setAcknowledgements(acknowledgementsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load content. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.lang]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#d8e1e8] flex items-center justify-center">
        <div className="text-center space-y-6">
          <Loader2 className="h-12 w-12 text-[#304674] animate-spin" />
          <p className="text-[#304674] text-lg">Loading our story...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#d8e1e8] flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-[#98bad5] rounded-full flex items-center justify-center mx-auto">
            <span className="text-[#304674] text-2xl">!</span>
          </div>
          <h1 className="text-2xl font-bold text-[#304674]">Oops! Something went wrong</h1>
          <p className="text-[#304674]/80">{error}</p>
          <Button 
            onClick={() => window.location.reload()} 
            className="bg-[#304674] hover:bg-[#304674]/90 text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d8e1e8]">
      {/* Header Section */}
      <header className="bg-[#304674] text-white shadow-md">
        <div className="container mx-auto px-4 py-6 md:py-8 flex flex-col gap-4 md:gap-8">
          <div className="flex items-center justify-between">
            <Link href={`/${params.lang}`}>
              <Button variant="ghost" className="text-white hover:bg-[#304674]/80 focus:ring-2 focus:ring-[#98bad5] px-2 md:px-4">
                <ArrowLeft className="h-4 w-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Back to Home</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
          </div>
          <div className="text-center max-w-3xl mx-auto px-2">
            <div className="inline-flex items-center gap-2 bg-[#98bad5] text-[#304674] px-3 py-1.5 md:px-4 md:py-2 rounded-full text-sm font-medium mb-4 md:mb-6">
              <Heart className="h-3 w-3 md:h-4 md:w-4" />
              <span className="text-xs md:text-sm">Meet Our Amazing Team</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold mb-3 md:mb-4 tracking-tight leading-tight">About LegalSathi</h1>
            <p className="text-base md:text-lg text-[#d8e1e8] font-medium">
              Empowering citizens with legal knowledge and support through innovative technology, 
              dedicated community service, and unwavering commitment to justice for all.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-2 md:px-4 py-6 md:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-6xl mx-auto  ">
        <TabsList className="flex flex-row w-full mb-6 md:mb-10 bg-[#c6d3e3] p-2 md:p-2.5 rounded-xl gap-2 md:gap-2.5 shadow-md">
  {[
    { value: "founders", label: "Founders", Icon: Users },
    { value: "team", label: "Team", Icon: Users },
    { value: "acknowledgements", label: "Acknowledgements", Icon: Award },
  ].map(({ value, label, Icon }) => (
    <TabsTrigger
      key={value}
      value={value}
      className="flex-1 text-base md:text-lg py-3.5 md:py-4 rounded-lg bg-transparent hover:bg-[#aabbd1] hover:text-[#1d2d47] data-[state=active]:bg-[#304674] data-[state=active]:text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#98bad5] font-medium touch-manipulation active:scale-[0.98]"
    >
      <div className="flex items-center justify-center gap-2 md:gap-2.5">
        <Icon className="h-4 w-4 md:h-5 md:w-5" />
        <span className="text-sm md:text-base">{label}</span>
      </div>
    </TabsTrigger>
  ))}
</TabsList>


          {/* Founders Tab */}
          <TabsContent value="founders" className="space-y-8 md:space-y-12">
            {founders.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#c6d3e3] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Users className="h-10 w-10 md:h-12 md:w-12 text-[#304674]" />
                </div>
                <p className="text-lg md:text-xl text-[#304674]/80">No founder information available in this language.</p>
              </div>
            ) : (
              <div className="space-y-8 md:space-y-12 max-w-5xl mx-auto">
                {founders.map((founder) => (
                  <Card 
                    key={founder.id} 
                    className="group overflow-hidden shadow-lg border-0 bg-white rounded-xl md:rounded-2xl flex flex-col md:flex-row transition-transform duration-300 hover:scale-[1.01]"
                  >
                    {/* Image Section */}
                    <div className="relative w-full md:w-1/3 aspect-[16/9] md:aspect-square bg-[#b2cbde] overflow-hidden">
                      {founder.imageUrl ? (
                        <div className="absolute inset-0">
                          <Image
                            src={founder.imageUrl}
                            alt={founder.name}
                            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#304674]/90 via-[#304674]/50 to-transparent" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#c6d3e3] flex items-center justify-center text-3xl md:text-4xl text-[#304674] font-bold shadow-lg">
                            {founder.name?.[0] || '?'}
                          </div>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-4">
                        <div>
                          <Badge className="mb-2 bg-[#98bad5] text-[#304674] border-0 text-sm px-3 py-1 rounded-full shadow-md">
                            Founder
                          </Badge>
                          <h3 className="text-xl md:text-2xl font-bold mb-1 leading-tight text-white drop-shadow-lg">
                            {founder.name}
                          </h3>
                          <p className="text-base text-white/90 font-medium drop-shadow-md">
                            {founder.title}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardContent className="p-4 md:p-6 flex-1">
                      <div className="flex flex-col h-full">
                        {founder.bio && (
                          <div className="mb-4">
                            <p className="text-[#304674]/90 leading-relaxed text-sm md:text-base font-medium">
                              {founder.bio}
                            </p>
                          </div>
                        )}

                        {/* Contact & Social Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                          {/* Contact Information */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-[#304674] flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              Contact
                            </h4>
                            <div className="space-y-2">
                              {founder.email && (
                                <a 
                                  href={`mailto:${founder.email}`} 
                                  className="flex items-center gap-2 px-3 py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                                >
                                  <Mail className="h-4 w-4" />
                                  <span className="font-medium truncate">{founder.email}</span>
                                </a>
                              )}
                              {founder.contactNumber && (
                                <a 
                                  href={`tel:${founder.contactNumber}`} 
                                  className="flex items-center gap-2 px-3 py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                                >
                                  <Phone className="h-4 w-4" />
                                  <span className="font-medium">{founder.contactNumber}</span>
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Social Links */}
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-[#304674] flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Connect
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {founder.socialLinks && (
                                <>
                                  {founder.socialLinks.linkedin && (
                                    <a 
                                      href={founder.socialLinks.linkedin} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="flex items-center gap-2 px-3 py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                                    >
                                      <Linkedin className="h-4 w-4" />
                                      <span className="font-medium">LinkedIn</span>
                                    </a>
                                  )}
                                  {founder.socialLinks.twitter && (
                                    <a 
                                      href={founder.socialLinks.twitter} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="flex items-center gap-2 px-3 py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                                    >
                                      <Twitter className="h-4 w-4" />
                                      <span className="font-medium">Twitter</span>
                                    </a>
                                  )}
                                  {founder.socialLinks.instagram && (
                                    <a 
                                      href={founder.socialLinks.instagram} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="flex items-center gap-2 px-3 py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                                    >
                                      <Instagram className="h-4 w-4" />
                                      <span className="font-medium">Instagram</span>
                                    </a>
                                  )}
                                  {founder.socialLinks.website && (
                                    <a 
                                      href={founder.socialLinks.website} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="flex items-center gap-2 px-3 py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-all duration-300 shadow-sm hover:shadow-md text-sm"
                                    >
                                      <Globe className="h-4 w-4" />
                                      <span className="font-medium">Website</span>
                                    </a>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Team Tab */}
          <TabsContent value="team" className="space-y-6 md:space-y-10">
            {teamMembers.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#c6d3e3] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Users className="h-10 w-10 md:h-12 md:w-12 text-[#304674]" />
                </div>
                <p className="text-lg md:text-xl text-[#304674]/80">No team member information available in this language.</p>
              </div>
            ) : (
              <div className="grid gap-4 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member) => (
                  <Card 
                    key={member.id} 
                    className="group overflow-hidden shadow-lg border-0 bg-white rounded-xl md:rounded-2xl flex flex-col transition-transform duration-300 hover:scale-[1.01]"
                  >
                    {member.imageUrl ? (
                      <div className="flex items-center justify-center bg-[#b2cbde] p-4 md:p-6">
                        <Image
                          src={member.imageUrl}
                          alt={member.name}
                          className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-full shadow-md border-4 border-[#c6d3e3]"
                          width={128}
                          height={128}
                          sizes="(max-width: 768px) 96px, 128px"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center justify-center bg-[#b2cbde] p-4 md:p-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-[#c6d3e3] flex items-center justify-center text-2xl md:text-3xl text-[#304674] font-bold">
                          {member.name?.[0] || '?'}
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4 md:p-6 flex flex-col gap-2">
                      <Badge className="w-fit mb-2 bg-[#304674] text-white border-0 text-sm md:text-base px-2 md:px-3 py-1 rounded-full">
                        {member.team}
                      </Badge>
                      <h3 className="text-lg md:text-xl font-bold mb-1 text-[#304674] leading-tight">
                        {member.name}
                      </h3>
                      <p className="text-sm md:text-base text-[#304674]/80 font-semibold mb-2">{member.role}</p>
                      {member.bio && (
                        <p className="text-[#304674]/70 leading-relaxed mb-4 text-xs md:text-sm lg:text-base">{member.bio}</p>
                      )}
                      <div className="flex flex-wrap gap-2 md:gap-3 mt-2">
                        {member.email && (
                          <a href={`mailto:${member.email}`} className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-colors text-xs md:text-sm">
                            <Mail className="h-3 w-3 md:h-4 md:w-4" />
                            Email
                          </a>
                        )}
                        {member.contactNumber && (
                          <a href={`tel:${member.contactNumber}`} className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-colors text-xs md:text-sm">
                            <Phone className="h-3 w-3 md:h-4 md:w-4" />
                            Call
                          </a>
                        )}
                        {member.socialLinks?.linkedin && (
                          <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-colors text-xs md:text-sm">
                            <Linkedin className="h-3 w-3 md:h-4 md:w-4" />
                            LinkedIn
                          </a>
                        )}
                        {member.socialLinks?.twitter && (
                          <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-colors text-xs md:text-sm">
                            <Twitter className="h-3 w-3 md:h-4 md:w-4" />
                            Twitter
                          </a>
                        )}
                        {member.socialLinks?.instagram && (
                          <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-colors text-xs md:text-sm">
                            <Instagram className="h-3 w-3 md:h-4 md:w-4" />
                            Instagram
                          </a>
                        )}
                        {member.socialLinks?.website && (
                          <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-[#c6d3e3] text-[#304674] rounded-lg hover:bg-[#98bad5] focus:ring-2 focus:ring-[#304674] transition-colors text-xs md:text-sm">
                            <Globe className="h-3 w-3 md:h-4 md:w-4" />
                            Website
                          </a>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Acknowledgements Tab */}
          <TabsContent value="acknowledgements" className="space-y-4 md:space-y-6">
            {acknowledgements.length === 0 ? (
              <div className="text-center py-12 md:py-16">
                <div className="w-20 h-20 md:w-24 md:h-24 bg-[#c6d3e3] rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                  <Award className="h-10 w-10 md:h-12 md:w-12 text-[#304674]" />
                </div>
                <p className="text-lg md:text-xl text-[#304674]/80">No acknowledgement information available in this language.</p>
              </div>
            ) : (
              <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
                {acknowledgements.map((acknowledgement) => (
                  <Card 
                    key={acknowledgement.id} 
                    className="group overflow-hidden shadow-md border-0 bg-white rounded-xl md:rounded-2xl flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-6 lg:p-8"
                  >
                    {acknowledgement.imageUrl ? (
                      <Image
                        src={acknowledgement.imageUrl}
                        alt={acknowledgement.name}
                        className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg shadow border-2 border-[#c6d3e3]"
                        width={80}
                        height={80}
                        sizes="(max-width: 768px) 64px, 80px"
                      />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-lg bg-[#c6d3e3] flex items-center justify-center text-xl md:text-2xl text-[#304674] font-bold">
                        {acknowledgement.name?.[0] || '?'}
                      </div>
                    )}
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="text-lg md:text-xl font-bold mb-1 text-[#304674]">
                        {acknowledgement.name}
                      </h3>
                      <p className="text-[#304674]/70 leading-relaxed text-sm md:text-base lg:text-lg">
                        {acknowledgement.contribution}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}