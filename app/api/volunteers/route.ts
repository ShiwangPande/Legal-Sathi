// app/api/volunteers/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { z } from 'zod'

// Validation schema
const volunteerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200, 'Name too long'),
  email: z.string().email('Invalid email address').max(255, 'Email too long'),
  organization: z.string().max(200, 'Organization name too long').optional(),
  helpOptions: z.object({
    translations: z.boolean(),
    recordings: z.boolean(),
    boards: z.boolean(),
    installations: z.boolean(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the data
    const validatedData = volunteerSchema.parse(body)
    
    // Check if volunteer with this email already exists
    const existingVolunteer = await prisma.volunteer.findFirst({
      where: { email: validatedData.email }
    })
    
    if (existingVolunteer) {
      return NextResponse.json(
        { error: 'A volunteer with this email already exists' },
        { status: 400 }
      )
    }
    
    // Create the volunteer record
    const volunteer = await prisma.volunteer.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        organization: validatedData.organization || null,
        translations: validatedData.helpOptions.translations,
        recordings: validatedData.helpOptions.recordings,
        boards: validatedData.helpOptions.boards,
        installations: validatedData.helpOptions.installations,
      },
    })
    
    return NextResponse.json(
      { 
        message: 'Volunteer registered successfully!',
        volunteer: {
          id: volunteer.id,
          name: volunteer.name,
          email: volunteer.email,
        }
      },
      { status: 201 }
    )
    
  } catch (error) {
    console.error('Error creating volunteer:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid data', details: error.errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const volunteers = await prisma.volunteer.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        organization: true,
        translations: true,
        recordings: true,
        boards: true,
        installations: true,
        createdAt: true,
      },
    })
    
    return NextResponse.json(volunteers)
  } catch (error) {
    console.error('Error fetching volunteers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}