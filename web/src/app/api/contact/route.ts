import { Resend } from 'resend';

type ContactBody = {
  name?: string;
  company?: string;
  projectType?: string;
  message?: string;
  email?: string;
};

function validate(body: ContactBody): string | null {
  if (!body.name?.trim()) return 'Name is required.';
  if (!body.email?.includes('@')) return 'A valid email is required.';
  if (!body.projectType?.trim()) return 'Project type is required.';
  if (!body.message?.trim()) return 'Project details are required.';
  return null;
}

export async function POST(request: Request) {
  const body = (await request.json()) as ContactBody;
  const error = validate(body);
  if (error) {
    return Response.json({ ok: false, error }, { status: 400 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await resend.emails.send({
      from: 'RKC Website <onboarding@resend.dev>',
      to: process.env.CONTACT_TO_EMAIL || 'raju2021rgh@gmail.com',
      replyTo: body.email,
      subject: `New inquiry from ${body.name}`,
      text: `Name: ${body.name}\nCompany: ${body.company || '—'}\nProject type: ${body.projectType}\nEmail: ${body.email}\n\n${body.message}`,
    });
  } catch {
    return Response.json(
      { ok: false, error: 'Could not send your inquiry right now. Please try again shortly or call us directly.' },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
