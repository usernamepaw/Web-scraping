void RenderText(Shader &shader, std::wstring text, float x, float y, float scale, glm::vec3 color)
{
    shader.use();
    glUniform3f(glUniformLocation(shader.ID, "textColor"), color.x, color.y, color.z);
    glActiveTexture(GL_TEXTURE0);
    glBindVertexArray(VA0);
    

    std::wstring::const_iterator c;
    for(c = text.begin(); c != text.end(); c++)
    {
        Character ch = Characters[*c];

        float xpos = x + ch.Bearing.x * scale;
        float ypos = y - (ch.Size.y - ch.Bearing.y) * scale;

        float w = ch.Size.x * scale;
        float h = ch.Size.y * scale;

        float vertices[6][4] = {
            { xpos,     ypos + h,       , 0.0f, 0.0f},
            { xpos,     ypos,           , 0.0f, 1.0f},
            { xpos + w, ypos,           , 1.0f, 1.0f},
            
            { xpos,     ypos + h,       , 0.0f, 0.0f},
            { xpos + w, ypos,           , 1.0f, 1.0f},
            { xpos + w, ypos + h,       , 1.0f, 0.0f},
        };
        glBindTexture(GL_TEXTURE_2D, ch.TextureID);

        glBindbuffer(GL_ARRAY_BUFFER, VB0);
        glBufferSubData(GL_ARRAY_BUFFER, 0, sizeof(vertices), vertices);
        glBindBuffer(GL_ARRAY_BUFFER, 0);
        glDrawArrays(GL_TRIANGLES, 0, 6);

        x += (ch.Advance >> 6) * scale;
    }

    glBindVertexArray(0);
    glBindTexture(GL_TEXTURE_2D, 0);
}