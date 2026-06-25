import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const signUp = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email, password, options: { data: { full_name: name } }
    });
    if (signUpError) return res.status(400).json({ success: false, message: signUpError.message });
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError || !signInData.session) return res.status(400).json({ success: false, message: 'Auto sign-in failed' });
    return res.status(201).json({
      success: true, message: 'Success!',
      data: { session: { access_token: signInData.session.access_token, user: signInData.user } }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return res.status(400).json({ success: false, message: error.message });
    return res.status(200).json({
      success: true, message: 'Login successful!',
      data: { session: { access_token: data.session.access_token, user: data.user } }
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
