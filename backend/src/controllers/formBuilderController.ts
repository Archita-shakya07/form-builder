import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

// Submit form response (Public - no auth required)
export const saveResponse = async (req: Request, res: Response) => {
  try {
    const { formId } = req.params;
    const { responseData, userEmail, userIp } = req.body;

    const { data, error } = await supabase
      .from('form_responses')
      .insert([{
        form_id: formId,
        user_email: userEmail,
        user_ip: userIp,
        response_data: responseData,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    res.status(201).json({
      success: true,
      message: 'Response saved!',
      data: data[0]
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all responses for a form (Auth required)
export const getFormResponses = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { formId } = req.params;

    // Check if user owns this form
    const { data: formData } = await supabase
      .from('custom_forms')
      .select('user_id')
      .eq('id', formId)
      .single();

    if (!formData || formData.user_id !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Fetch responses
    const { data: responses, error } = await supabase
      .from('form_responses')
      .select('*')
      .eq('form_id', formId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Calculate analytics
    const totalResponses = responses?.length || 0;
    const todayResponses = responses?.filter(r => {
      const date = new Date(r.created_at);
      const today = new Date();
      return date.toDateString() === today.toDateString();
    }).length || 0;

    // Daily stats for chart
    const dailyMap = new Map();
    responses?.forEach(r => {
      const date = new Date(r.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
      dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
    });
    const dailyStats = Array.from(dailyMap, ([date, count]) => ({ date, count }));

    // Device stats for pie chart
    const deviceMap = new Map();
    responses?.forEach(r => {
      const device = r.response_data?.device || 'Desktop';
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });
    const deviceStats = Array.from(deviceMap, ([name, value]) => ({ name, value }));

    res.status(200).json({
      success: true,
      data: {
        responses: responses || [],
        analytics: {
          totalResponses,
          todayResponses,
          avgTime: '2m 30s',
          completionRate: 85
        },
        dailyStats:dailyStats || [], 
        deviceStats:deviceStats || [] 
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create new form
export const createForm = async (req: Request, res: Response) => {
  try {
    const { title, description, elements } = req.body;
    const userId = (req as any).user?.id;

    const { data, error } = await supabase
      .from('custom_forms')
      .insert([{
        user_id: userId,
        title,
        description,
        elements: JSON.stringify(elements),
        is_public: false,
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) throw error;

    res.status(201).json({ success: true, data: data[0] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get user's forms
export const getUserForms = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;

    const { data, error } = await supabase
      .from('custom_forms')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json({ success: true, data: data || [] });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};