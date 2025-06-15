"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ExternalLink, User, Users, Heart } from "lucide-react";
import Link from "next/link";
import { translateAndSaveContent } from "@/lib/translations";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUploadThing } from "@/lib/uploadthing-client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Language {
  code: string;
  name: string;
}

interface Founder {
  id: number;
  name: string;
  title: string;
  bio: string;
  imageUrl: string;
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
  imageUrl: string;
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

export default function AboutAdminPage() {
  const { toast } = useToast();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [founders, setFounders] = useState<Founder[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [acknowledgements, setAcknowledgements] = useState<Acknowledgement[]>([]);
  const [loading, setLoading] = useState(true);
  const [translationStatus, setTranslationStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"founder" | "team" | "acknowledgement">("founder");

  // Edit states
  const [editingFounderId, setEditingFounderId] = useState<number | undefined>(undefined);
  const [editingTeamId, setEditingTeamId] = useState<number | undefined>(undefined);
  const [editingAcknowledgementId, setEditingAcknowledgementId] = useState<number | undefined>(undefined);

  // Form states
  const [founderTitle, setFounderTitle] = useState("");
  const [founderDescription, setFounderDescription] = useState("");
  const [founderContent, setFounderContent] = useState("");
  const [founderImageUrl, setFounderImageUrl] = useState("");
  const [founderEmail, setFounderEmail] = useState("");
  const [founderContactNumber, setFounderContactNumber] = useState("");
  const [founderSocialLinks, setFounderSocialLinks] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    website: ""
  });

  const [teamTitle, setTeamTitle] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamContent, setTeamContent] = useState("");
  const [teamImageUrl, setTeamImageUrl] = useState("");
  const [teamType, setTeamType] = useState("content");
  const [teamEmail, setTeamEmail] = useState("");
  const [teamContactNumber, setTeamContactNumber] = useState("");
  const [teamSocialLinks, setTeamSocialLinks] = useState({
    linkedin: "",
    twitter: "",
    instagram: "",
    website: ""
  });

  const [acknowledgementTitle, setAcknowledgementTitle] = useState("");
  const [acknowledgementDescription, setAcknowledgementDescription] = useState("");
  const [acknowledgementImageUrl, setAcknowledgementImageUrl] = useState("");

  // Loading states
  const [founderLoading, setFounderLoading] = useState(false);
  const [teamLoading, setTeamLoading] = useState(false);
  const [acknowledgementLoading, setAcknowledgementLoading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

  // Fetch languages on component mount
  const fetchLanguages = async () => {
    try {
      const response = await fetch("/api/languages");
      if (response.ok) {
        const languagesData = await response.json();
        setLanguages(languagesData);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel with proper error handling
      const [foundersRes, teamRes, acknowledgementsRes] = await Promise.all([
        fetch("/api/admin/about/founder?languageCode=en").then(res => {
          if (!res.ok) throw new Error(`Founder API error: ${res.status}`);
          return res.json();
        }),
        fetch("/api/admin/about/team?languageCode=en").then(res => {
          if (!res.ok) throw new Error(`Team API error: ${res.status}`);
          return res.json();
        }),
        fetch("/api/admin/about/acknowledgement?languageCode=en").then(res => {
          if (!res.ok) throw new Error(`Acknowledgement API error: ${res.status}`);
          return res.json();
        })
      ]);

      // Set the data
      setFounders(foundersRes);
      setTeamMembers(teamRes);
      setAcknowledgements(acknowledgementsRes);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
    fetchData();
  }, []);

  const handleImageUpload = async (file: File, setImageUrl: (url: string) => void) => {
    try {
      const res = await startUpload([file]);
      
      if (!res?.[0]) {
        throw new Error("Failed to upload image");
      }

      setImageUrl(res[0].url);
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleEditFounder = (founder: Founder) => {
    setEditingFounderId(founder.id);
    setFounderTitle(founder.name);
    setFounderDescription(founder.title);
    setFounderContent(founder.bio);
    setFounderImageUrl(founder.imageUrl);
    setFounderEmail(founder.email || "");
    setFounderContactNumber(founder.contactNumber || "");
    setFounderSocialLinks({
      linkedin: founder.socialLinks?.linkedin || "",
      twitter: founder.socialLinks?.twitter || "",
      instagram: founder.socialLinks?.instagram || "",
      website: founder.socialLinks?.website || ""
    });
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamId(member.id);
    setTeamTitle(member.name);
    setTeamDescription(member.role);
    setTeamContent(member.bio);
    setTeamImageUrl(member.imageUrl);
    setTeamType(member.team);
    setTeamEmail(member.email || "");
    setTeamContactNumber(member.contactNumber || "");
    setTeamSocialLinks({
      linkedin: member.socialLinks?.linkedin || "",
      twitter: member.socialLinks?.twitter || "",
      instagram: member.socialLinks?.instagram || "",
      website: member.socialLinks?.website || ""
    });
  };

  const handleEditAcknowledgement = (acknowledgement: Acknowledgement) => {
    setEditingAcknowledgementId(acknowledgement.id);
    setAcknowledgementTitle(acknowledgement.name);
    setAcknowledgementDescription(acknowledgement.contribution);
    setAcknowledgementImageUrl(acknowledgement.imageUrl || "");
  };

  const handleFounderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFounderLoading(true);
    try {
      const result = await translateAndSaveContent("founder", {
        title: founderTitle,
        description: founderDescription,
        content: founderContent,
        imageUrl: founderImageUrl,
        id: editingFounderId || undefined,
        email: founderEmail,
        contactNumber: founderContactNumber,
        socialLinks: founderSocialLinks
      });

      if (result.success) {
        toast({
          title: "Success",
          description: editingFounderId 
            ? "Founder information updated successfully"
            : "Founder information saved and translated successfully",
        });
        resetForm("founder");
        setEditingFounderId(undefined);
        fetchData();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save founder information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving founder:", error);
      toast({
        title: "Error",
        description: "Failed to save founder information",
        variant: "destructive",
      });
    } finally {
      setFounderLoading(false);
    }
  };

  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamLoading(true);
    try {
      const result = await translateAndSaveContent("team", {
        title: teamTitle,
        description: teamDescription,
        content: teamContent,
        imageUrl: teamImageUrl,
        id: editingTeamId || undefined,
        team: teamType
      });

      if (result.success) {
        toast({
          title: "Success",
          description: editingTeamId 
            ? "Team member information updated successfully"
            : "Team member information saved and translated successfully",
        });
        resetForm("team");
        setEditingTeamId(undefined);
        fetchData();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save team member information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving team member:", error);
      toast({
        title: "Error",
        description: "Failed to save team member information",
        variant: "destructive",
      });
    } finally {
      setTeamLoading(false);
    }
  };

  const handleAcknowledgementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAcknowledgementLoading(true);
    try {
      const result = await translateAndSaveContent("acknowledgement", {
        title: acknowledgementTitle,
        description: acknowledgementDescription,
        content: "",
        imageUrl: acknowledgementImageUrl,
        id: editingAcknowledgementId || undefined
      });

      if (result.success) {
        toast({
          title: "Success",
          description: editingAcknowledgementId 
            ? "Acknowledgement information updated successfully"
            : "Acknowledgement information saved and translated successfully",
        });
        resetForm("acknowledgement");
        setEditingAcknowledgementId(undefined);
        fetchData();
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to save acknowledgement information",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error saving acknowledgement:", error);
      toast({
        title: "Error",
        description: "Failed to save acknowledgement information",
        variant: "destructive",
      });
    } finally {
      setAcknowledgementLoading(false);
    }
  };

  const handleDelete = async (type: "founder" | "team" | "acknowledgement", id: number) => {
    try {
      const response = await fetch(`/api/admin/about/${type}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete ${type}`);
      }

      toast({
        title: "Success",
        description: `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`,
      });

      fetchData();
    } catch (error) {
      console.error(`Error deleting ${type}:`, error);
      toast({
        title: "Error",
        description: `Failed to delete ${type}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const resetForm = (type: "founder" | "team" | "acknowledgement") => {
    switch (type) {
      case "founder":
        setFounderTitle("");
        setFounderDescription("");
        setFounderContent("");
        setFounderImageUrl("");
        setFounderEmail("");
        setFounderContactNumber("");
        setFounderSocialLinks({
          linkedin: "",
          twitter: "",
          instagram: "",
          website: ""
        });
        setEditingFounderId(undefined);
        break;
      case "team":
        setTeamTitle("");
        setTeamDescription("");
        setTeamContent("");
        setTeamImageUrl("");
        setTeamType("content");
        setTeamEmail("");
        setTeamContactNumber("");
        setTeamSocialLinks({
          linkedin: "",
          twitter: "",
          instagram: "",
          website: ""
        });
        setEditingTeamId(undefined);
        break;
      case "acknowledgement":
        setAcknowledgementTitle("");
        setAcknowledgementDescription("");
        setAcknowledgementImageUrl("");
        setEditingAcknowledgementId(undefined);
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">About Us Content Management</h1>
          <p className="text-muted-foreground mt-2">
            Add content in English - translations will be generated automatically for {languages.length - 1} other languages
          </p>
        </div>
        <Link href="/" target="_blank">
          <Button variant="outline" className="gap-2 w-full lg:w-auto">
            <ExternalLink className="h-4 w-4" />
            View Public Page
          </Button>
        </Link>
      </div>

      {translationStatus && (
        <Alert className="mb-6">
          <Loader2 className="h-4 w-4 animate-spin" />
          <AlertDescription>{translationStatus}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-8">
        <Tabs defaultValue="founder" className="w-full" onValueChange={(value) => setActiveTab(value as "founder" | "team" | "acknowledgement")}>
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="founder" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Founder</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Team</span>
            </TabsTrigger>
            <TabsTrigger value="acknowledgement" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Acknowledgement</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="founder" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleFounderSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        {editingFounderId ? "Edit Founder" : "Add Founder"}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Input
                            value={founderTitle}
                            onChange={(e) => setFounderTitle(e.target.value)}
                            placeholder="Enter founder's name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Title</label>
                          <Input
                            value={founderDescription}
                            onChange={(e) => setFounderDescription(e.target.value)}
                            placeholder="Enter founder's title"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Input
                            type="email"
                            value={founderEmail}
                            onChange={(e) => setFounderEmail(e.target.value)}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Contact Number</label>
                          <Input
                            type="tel"
                            value={founderContactNumber}
                            onChange={(e) => setFounderContactNumber(e.target.value)}
                            placeholder="Enter contact number"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <Textarea
                          value={founderContent}
                          onChange={(e) => setFounderContent(e.target.value)}
                          placeholder="Enter founder's bio"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Image</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, setFounderImageUrl);
                            }
                          }}
                        />
                        {founderImageUrl && (
                          <div className="mt-2">
                            <img
                              src={founderImageUrl}
                              alt="Founder"
                              className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium mb-1">Social Links</label>
                        <div className="grid gap-4 md:grid-cols-2">
                          <Input
                            value={founderSocialLinks.linkedin}
                            onChange={(e) => setFounderSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="LinkedIn URL"
                          />
                          <Input
                            value={founderSocialLinks.twitter}
                            onChange={(e) => setFounderSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                            placeholder="Twitter URL"
                          />
                          <Input
                            value={founderSocialLinks.instagram}
                            onChange={(e) => setFounderSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                            placeholder="Instagram URL"
                          />
                          <Input
                            value={founderSocialLinks.website}
                            onChange={(e) => setFounderSocialLinks(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="Personal Website URL"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={founderLoading} className="flex-1 lg:flex-none">
                        {founderLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingFounderId ? "Update" : "Save"}
                      </Button>
                      {editingFounderId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => resetForm("founder")}
                          className="flex-1 lg:flex-none"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-6">Existing Founders</h2>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="grid gap-4">
                      {founders
                        .filter(founder => founder.languageCode === 'en')
                        .map((founder) => (
                          <Card key={founder.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="flex flex-col sm:flex-row gap-4">
                                {founder.imageUrl && (
                                  <img
                                    src={founder.imageUrl}
                                    alt={founder.name}
                                    className="w-24 h-24 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <h4 className="font-medium">{founder.name}</h4>
                                  <p className="text-sm text-muted-foreground">{founder.title}</p>
                                  <p className="mt-2 text-sm">{founder.bio}</p>
                                  {founder.email && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Email: <a href={`mailto:${founder.email}`} className="text-blue-600 hover:underline">{founder.email}</a>
                                    </p>
                                  )}
                                  {founder.contactNumber && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Contact: <a href={`tel:${founder.contactNumber}`} className="text-blue-600 hover:underline">{founder.contactNumber}</a>
                                    </p>
                                  )}
                                  {founder.socialLinks && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {founder.socialLinks.linkedin && (
                                        <a href={founder.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                          LinkedIn
                                        </a>
                                      )}
                                      {founder.socialLinks.twitter && (
                                        <a href={founder.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                          Twitter
                                        </a>
                                      )}
                                      {founder.socialLinks.instagram && (
                                        <a href={founder.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                          Instagram
                                        </a>
                                      )}
                                      {founder.socialLinks.website && (
                                        <a href={founder.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                          Website
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditFounder(founder)}
                                  className="flex-1 lg:flex-none"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete("founder", founder.id)}
                                  className="flex-1 lg:flex-none"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">
                              Translations: {founders.filter(f => f.id !== founder.id && f.name === founder.name).length} / {languages.length - 1}
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="team" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleTeamSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        {editingTeamId ? "Edit Team Member" : "Add Team Member"}
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Name</label>
                          <Input
                            value={teamTitle}
                            onChange={(e) => setTeamTitle(e.target.value)}
                            placeholder="Enter team member's name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Role</label>
                          <Input
                            value={teamDescription}
                            onChange={(e) => setTeamDescription(e.target.value)}
                            placeholder="Enter team member's role"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium mb-1">Email</label>
                          <Input
                            type="email"
                            value={teamEmail}
                            onChange={(e) => setTeamEmail(e.target.value)}
                            placeholder="Enter email address"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Contact Number</label>
                          <Input
                            type="tel"
                            value={teamContactNumber}
                            onChange={(e) => setTeamContactNumber(e.target.value)}
                            placeholder="Enter contact number"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Bio</label>
                        <Textarea
                          value={teamContent}
                          onChange={(e) => setTeamContent(e.target.value)}
                          placeholder="Enter team member's bio"
                          rows={4}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Team Type</label>
                        <select
                          value={teamType}
                          onChange={(e) => setTeamType(e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          <option value="content">Content</option>
                          <option value="design">Design</option>
                          <option value="outreach">Outreach</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Image</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, setTeamImageUrl);
                            }
                          }}
                        />
                        {teamImageUrl && (
                          <div className="mt-2">
                            <img
                              src={teamImageUrl}
                              alt="Team Member"
                              className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-medium mb-1">Social Links</label>
                        <div className="grid gap-4 md:grid-cols-2">
                          <Input
                            value={teamSocialLinks.linkedin}
                            onChange={(e) => setTeamSocialLinks(prev => ({ ...prev, linkedin: e.target.value }))}
                            placeholder="LinkedIn URL"
                          />
                          <Input
                            value={teamSocialLinks.twitter}
                            onChange={(e) => setTeamSocialLinks(prev => ({ ...prev, twitter: e.target.value }))}
                            placeholder="Twitter URL"
                          />
                          <Input
                            value={teamSocialLinks.instagram}
                            onChange={(e) => setTeamSocialLinks(prev => ({ ...prev, instagram: e.target.value }))}
                            placeholder="Instagram URL"
                          />
                          <Input
                            value={teamSocialLinks.website}
                            onChange={(e) => setTeamSocialLinks(prev => ({ ...prev, website: e.target.value }))}
                            placeholder="Personal Website URL"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={teamLoading} className="flex-1 lg:flex-none">
                        {teamLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingTeamId ? "Update" : "Save"}
                      </Button>
                      {editingTeamId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => resetForm("team")}
                          className="flex-1 lg:flex-none"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-6">Existing Team Members</h2>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="grid gap-4">
                      {teamMembers
                        .filter(member => member.languageCode === 'en')
                        .map((member) => (
                          <Card key={member.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="flex flex-col sm:flex-row gap-4">
                                {member.imageUrl && (
                                  <img
                                    src={member.imageUrl}
                                    alt={member.name}
                                    className="w-24 h-24 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <h4 className="font-medium">{member.name}</h4>
                                  <p className="text-sm text-muted-foreground">{member.role}</p>
                                  <p className="mt-2 text-sm">{member.bio}</p>
                                  <p className="text-xs text-muted-foreground mt-1">Team: {member.team}</p>
                                  {member.email && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Email: <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">{member.email}</a>
                                    </p>
                                  )}
                                  {member.contactNumber && (
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Contact: <a href={`tel:${member.contactNumber}`} className="text-blue-600 hover:underline">{member.contactNumber}</a>
                                    </p>
                                  )}
                                  {member.socialLinks && (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                      {member.socialLinks.linkedin && (
                                        <a href={member.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                          LinkedIn
                                        </a>
                                      )}
                                      {member.socialLinks.twitter && (
                                        <a href={member.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                          Twitter
                                        </a>
                                      )}
                                      {member.socialLinks.instagram && (
                                        <a href={member.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                          Instagram
                                        </a>
                                      )}
                                      {member.socialLinks.website && (
                                        <a href={member.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm">
                                          Website
                                        </a>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditTeamMember(member)}
                                  className="flex-1 lg:flex-none"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete("team", member.id)}
                                  className="flex-1 lg:flex-none"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">
                              Translations: {teamMembers.filter(m => m.id !== member.id && m.name === member.name).length} / {languages.length - 1}
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="acknowledgement" className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <form onSubmit={handleAcknowledgementSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium">
                        {editingAcknowledgementId ? "Edit Acknowledgement" : "Add Acknowledgement"}
                      </h3>
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <Input
                          value={acknowledgementTitle}
                          onChange={(e) => setAcknowledgementTitle(e.target.value)}
                          placeholder="Enter name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Contribution</label>
                        <Textarea
                          value={acknowledgementDescription}
                          onChange={(e) => setAcknowledgementDescription(e.target.value)}
                          placeholder="Enter contribution"
                          rows={4}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Image</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleImageUpload(file, setAcknowledgementImageUrl);
                            }
                          }}
                        />
                        {acknowledgementImageUrl && (
                          <div className="mt-2">
                            <img
                              src={acknowledgementImageUrl}
                              alt="Acknowledgement"
                              className="w-24 h-24 lg:w-32 lg:h-32 object-cover rounded"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={acknowledgementLoading} className="flex-1 lg:flex-none">
                        {acknowledgementLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingAcknowledgementId ? "Update" : "Save"}
                      </Button>
                      {editingAcknowledgementId && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => resetForm("acknowledgement")}
                          className="flex-1 lg:flex-none"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-6">Existing Acknowledgements</h2>
                  <ScrollArea className="h-[600px] pr-4">
                    <div className="grid gap-4">
                      {acknowledgements
                        .filter(ack => ack.languageCode === 'en')
                        .map((ack) => (
                          <Card key={ack.id} className="p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                              <div className="flex flex-col sm:flex-row gap-4">
                                {ack.imageUrl && (
                                  <img
                                    src={ack.imageUrl}
                                    alt={ack.name}
                                    className="w-24 h-24 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <h4 className="font-medium">{ack.name}</h4>
                                  <p className="mt-2 text-sm">{ack.contribution}</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleEditAcknowledgement(ack)}
                                  className="flex-1 lg:flex-none"
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleDelete("acknowledgement", ack.id)}
                                  className="flex-1 lg:flex-none"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="mt-4 text-sm text-muted-foreground">
                              Translations: {acknowledgements.filter(a => a.id !== ack.id && a.name === ack.name).length} / {languages.length - 1}
                            </div>
                          </Card>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}