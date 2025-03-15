-- Add analytics table for dashboard insights
CREATE TABLE IF NOT EXISTS analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_customers INTEGER DEFAULT 0,
    active_tasks INTEGER DEFAULT 0,
    completed_tasks INTEGER DEFAULT 0,
    customer_growth DECIMAL DEFAULT 0,
    chat_interactions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
);

-- Add RLS policies for analytics
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own analytics"
    ON analytics
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics"
    ON analytics
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Add indexes for analytics
CREATE INDEX analytics_user_id_idx ON analytics(user_id);

-- Add trigger to update analytics on chat interactions
CREATE OR REPLACE FUNCTION update_chat_interactions()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO analytics (user_id, chat_interactions)
    VALUES (NEW.user_id, 1)
    ON CONFLICT (user_id)
    DO UPDATE SET
        chat_interactions = analytics.chat_interactions + 1,
        updated_at = timezone('utc', now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER increment_chat_interactions
    AFTER INSERT ON chat_history
    FOR EACH ROW
    EXECUTE FUNCTION update_chat_interactions();

-- Add new columns to chat_history for better organization
ALTER TABLE chat_history
    ADD COLUMN IF NOT EXISTS command_type VARCHAR(50),
    ADD COLUMN IF NOT EXISTS sentiment VARCHAR(20),
    ADD COLUMN IF NOT EXISTS export_id UUID,
    ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Create index for better chat history filtering
CREATE INDEX chat_history_command_type_idx ON chat_history(command_type);
CREATE INDEX chat_history_export_id_idx ON chat_history(export_id);
CREATE INDEX chat_history_tags_idx ON chat_history USING GIN(tags);

-- Create a function to export chat history
CREATE OR REPLACE FUNCTION export_chat_history(p_user_id UUID, p_start_date TIMESTAMP, p_end_date TIMESTAMP)
RETURNS TABLE (
    export_data JSONB
) AS $$
DECLARE
    v_export_id UUID;
BEGIN
    -- Generate new export ID
    v_export_id := gen_random_uuid();
    
    -- Update chat history with export ID
    UPDATE chat_history
    SET export_id = v_export_id
    WHERE user_id = p_user_id
    AND created_at BETWEEN p_start_date AND p_end_date;
    
    -- Return formatted chat history
    RETURN QUERY
    SELECT jsonb_build_object(
        'export_id', v_export_id,
        'user_id', p_user_id,
        'export_date', now(),
        'period', jsonb_build_object(
            'start', p_start_date,
            'end', p_end_date
        ),
        'messages', jsonb_agg(
            jsonb_build_object(
                'message', message,
                'response', response,
                'command_type', command_type,
                'sentiment', sentiment,
                'tags', tags,
                'created_at', created_at
            ) ORDER BY created_at
        )
    )
    FROM chat_history
    WHERE export_id = v_export_id
    GROUP BY user_id;
END;
$$ LANGUAGE plpgsql;
