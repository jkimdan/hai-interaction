
export async function uploadFile(formData) {
    // add multipart/form-data to the  headers

    try {
        const response = await fetch(`https://hai-interaction.onrender.com/upload`, {
            method: "POST",
            body: formData,
        });

        const data = await response.json();
        return data.file_url;
    } catch (error) {
        console.error("Error uploading file:", error);
    }
}