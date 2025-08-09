import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    
    const salesLead = {
      name: formData.get("name") as string,
      company: formData.get("company") as string,
      email: formData.get("email") as string,
      country: formData.get("country") as string,
      message: formData.get("message") as string,
      audience: formData.get("audience") as string,
      interests: formData.get("interests") as string,
      timestamp: new Date().toISOString(),
    };

    // Handle file upload if present
    const file = formData.get("file") as File | null;
    if (file) {
      // In a real implementation, you would:
      // 1. Validate file type and size
      // 2. Upload to cloud storage (AWS S3, etc.)
      // 3. Store the file URL in the sales lead data
      console.log("File uploaded:", file.name, file.size, file.type);
    }

    // In a real implementation, you would:
    // 1. Save to database (e.g., PostgreSQL, MongoDB)
    // 2. Send notification email to sales team
    // 3. Add to CRM system (e.g., HubSpot, Salesforce)
    // 4. Set up automated follow-up sequences
    
    console.log("Sales lead received:", salesLead);

    // Simulate async processing
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json({ 
      success: true, 
      message: "Sales lead submitted successfully",
      leadId: `lead_${Date.now()}` // In real app, this would be from database
    });

  } catch (error) {
    console.error("Error processing sales lead:", error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to submit sales lead" 
      },
      { status: 500 }
    );
  }
}